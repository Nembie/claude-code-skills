# Migration Risks Reference

## Dangerous PostgreSQL Operations

| Operation | Risk | Lock Type | Safe Alternative |
|---|---|---|---|
| `DROP TABLE` | Permanent data loss | AccessExclusive | Rename to `_archived_*`, drop later |
| `DROP COLUMN` | Permanent data loss | AccessExclusive | Rename to `_deprecated_*`, drop later |
| `ALTER COLUMN TYPE` | Data truncation/loss | AccessExclusive | Add new column → backfill → swap → drop old |
| `SET NOT NULL` | Fails on NULL rows | AccessExclusive | Backfill NULLs first, then add constraint |
| `ADD UNIQUE` | Fails on duplicates | ShareLock | Deduplicate first, then add constraint |
| `ADD COLUMN ... DEFAULT` (PG < 11) | Table rewrite, long lock | AccessExclusive | Add nullable → backfill → set default → set not null |
| `CREATE INDEX` | Blocks writes (without CONCURRENTLY) | ShareLock | Use `CREATE INDEX CONCURRENTLY` |
| `ALTER TYPE (enum)` | Enum drop/recreate loses data | AccessExclusive | Add new values with `ALTER TYPE ... ADD VALUE` |

## Zero-Downtime Migration Patterns

### Rename a Column

Never rename directly (Prisma generates drop + add).

```sql
-- Step 1: Add new column
ALTER TABLE "User" ADD COLUMN "full_name" TEXT;

-- Step 2: Backfill
UPDATE "User" SET "full_name" = "name";

-- Step 3: Deploy code that reads from both columns (fallback)

-- Step 4: (Next migration) Drop old column
ALTER TABLE "User" DROP COLUMN "name";
```

Or, if you can tolerate a brief lock:

```sql
ALTER TABLE "User" RENAME COLUMN "name" TO "full_name";
```

### Change Column Type

```sql
-- Step 1: Add new column with target type
ALTER TABLE "Product" ADD COLUMN "price_decimal" DECIMAL(10,2);

-- Step 2: Backfill
UPDATE "Product" SET "price_decimal" = "price_cents"::decimal / 100;

-- Step 3: Deploy code reading from new column

-- Step 4: Drop old column
ALTER TABLE "Product" DROP COLUMN "price_cents";

-- Step 5: Rename new column
ALTER TABLE "Product" RENAME COLUMN "price_decimal" TO "price";
```

### Add NOT NULL Constraint

```sql
-- Step 1: Backfill NULLs
UPDATE "User" SET "name" = 'Unknown' WHERE "name" IS NULL;

-- Step 2: Add constraint with NOT VALID (skips full table scan)
ALTER TABLE "User" ADD CONSTRAINT "user_name_not_null"
  CHECK ("name" IS NOT NULL) NOT VALID;

-- Step 3: Validate constraint (ShareUpdateExclusiveLock — non-blocking)
ALTER TABLE "User" VALIDATE CONSTRAINT "user_name_not_null";

-- Step 4: Set NOT NULL (now safe — constraint ensures no NULLs)
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "User" DROP CONSTRAINT "user_name_not_null";
```

### Add Index Without Downtime

```sql
-- WRONG: Blocks all writes until index is built
CREATE INDEX "User_email_idx" ON "User"("email");

-- RIGHT: Builds index in background, allows concurrent writes
CREATE INDEX CONCURRENTLY "User_email_idx" ON "User"("email");
```

Note: `CONCURRENTLY` cannot run inside a transaction. In Prisma, this means you need a raw SQL migration executed outside the default migration transaction.

### Add Enum Value

```sql
-- PostgreSQL allows adding values to existing enums without recreation
ALTER TYPE "Role" ADD VALUE 'MODERATOR';
```

This is safe and non-blocking. However, removing enum values requires the full drop/recreate cycle — which is dangerous.

### Split a Table

```sql
-- Step 1: Create new table
CREATE TABLE "UserProfile" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE REFERENCES "User"("id"),
  "bio" TEXT,
  "avatar" TEXT
);

-- Step 2: Backfill
INSERT INTO "UserProfile" ("id", "userId", "bio", "avatar")
SELECT gen_random_uuid(), "id", "bio", "avatar" FROM "User";

-- Step 3: Deploy code using new table

-- Step 4: Drop columns from original table
ALTER TABLE "User" DROP COLUMN "bio";
ALTER TABLE "User" DROP COLUMN "avatar";
```

## Pre-Deploy Migration Review Checklist

1. **Generate migration**: `npx prisma migrate dev --create-only`
2. **Read the SQL**: Never apply without reading `migration.sql`
3. **Check for drops**: Search for `DROP COLUMN`, `DROP TABLE`
4. **Check for type changes**: Search for `ALTER COLUMN ... TYPE`
5. **Check for NOT NULL**: Search for `SET NOT NULL` — verify backfill exists
6. **Check for UNIQUE/indexes**: Search for `ADD CONSTRAINT ... UNIQUE`
7. **Check enum changes**: Look for `CREATE TYPE ... AS ENUM` paired with `DROP TYPE`
8. **Estimate lock duration**: For tables > 1M rows, consider lock impact
9. **Test on staging**: Apply migration to a copy of production data
10. **Plan rollback**: Document the reverse SQL for each change
