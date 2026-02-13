# Prisma → Zod Type Mapping

## Scalar Type Mapping

| Prisma Type | Zod Equivalent | Notes |
|---|---|---|
| `String` | `z.string()` | |
| `String?` | `z.string().nullable()` | Use `.nullable()` not `.optional()` — Prisma nulls are explicit |
| `Int` | `z.number().int()` | |
| `Float` | `z.number()` | |
| `Decimal` | `z.number()` | Or `z.string().regex(/^\d+(\.\d+)?$/)` for precision-sensitive fields |
| `BigInt` | `z.bigint()` | Or `z.number().int()` if values fit in Number range |
| `Boolean` | `z.boolean()` | |
| `DateTime` | `z.coerce.date()` | `z.coerce` handles ISO string → Date conversion |
| `Json` | `z.unknown()` | Or a specific shape if the JSON structure is known |
| `Bytes` | `z.instanceof(Buffer)` | Rarely validated at API boundary |

## Prisma Attribute Handling

### Input Schema (create/update)

| Attribute | Handling |
|---|---|
| `@id` | Omit from create schema. Include in update schema as optional identifier. |
| `@default(...)` | Make field `.optional()` in create schema — Prisma fills the default. |
| `@default(now())` | Omit from create schema entirely. |
| `@default(cuid())` / `@default(uuid())` | Omit from create schema entirely. |
| `@default(autoincrement())` | Omit from create schema entirely. |
| `@updatedAt` | Omit from both create and update schemas. |
| `@unique` | No special Zod handling — uniqueness is a DB constraint, not a schema concern. |
| `@map` / `@@map` | Use the Prisma field name (not the DB column name) in the schema. |

### Output Schema (API response)

Include all fields. Auto-generated fields (`@id`, `@default`, `@updatedAt`) are present in output.

## Enum Mapping

```prisma
enum Role {
  USER
  ADMIN
  MODERATOR
}
```

```typescript
export const roleSchema = z.enum(["USER", "ADMIN", "MODERATOR"]);
```

If the Prisma enum is used across many schemas, define it once and reference it:

```typescript
// lib/validations/enums.ts
export const roleSchema = z.enum(["USER", "ADMIN", "MODERATOR"]);
export type Role = z.infer<typeof roleSchema>;
```

## Relation Patterns

### One-to-One

```prisma
model User {
  profile Profile?
}
model Profile {
  user   User   @relation(fields: [userId], references: [id])
  userId String @unique
}
```

**Input (create User with Profile):**
```typescript
const createUserSchema = z.object({
  // ...user fields
  profile: z.object({
    create: createProfileSchema,
  }).optional(),
});
```

**Input (connect existing):**
```typescript
const createProfileSchema = z.object({
  // ...profile fields
  user: z.object({ connect: z.object({ id: z.string() }) }),
});
```

### One-to-Many

```prisma
model User {
  posts Post[]
}
```

**Input (create with nested posts):**
```typescript
const createUserSchema = z.object({
  // ...user fields
  posts: z.object({
    create: z.array(createPostSchema),
  }).optional(),
});
```

**Output:**
```typescript
const userWithPostsSchema = userSchema.extend({
  posts: z.array(postSchema),
});
```

### Many-to-Many (implicit)

```prisma
model Post {
  tags Tag[]
}
model Tag {
  posts Post[]
}
```

**Input (connect by ID):**
```typescript
const createPostSchema = z.object({
  // ...post fields
  tags: z.object({
    connect: z.array(z.object({ id: z.string() })),
  }).optional(),
});
```

## Refinements Catalog

### String Refinements

| Pattern | Zod Refinement |
|---|---|
| Email | `.email().trim().toLowerCase()` |
| URL | `.url()` |
| UUID | `.uuid()` |
| CUID | `.cuid()` |
| CUID2 | `.cuid2()` |
| Slug | `.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)` |
| Hex color | `.regex(/^#[0-9a-fA-F]{6}$/)` |
| ISO date string | `.datetime()` |
| Non-empty | `.min(1)` |
| Trimmed | `.trim()` |

### Number Refinements

| Pattern | Zod Refinement |
|---|---|
| Positive integer | `.int().positive()` |
| Non-negative | `.nonnegative()` |
| Percentage | `.min(0).max(100)` |
| Port number | `.int().min(1).max(65535)` |
| Latitude | `.min(-90).max(90)` |
| Longitude | `.min(-180).max(180)` |

### Transform Patterns

```typescript
// Trim and lowercase email
z.string().email().trim().toLowerCase()

// Parse numeric string to number
z.string().transform(Number).pipe(z.number().positive())

// Default value
z.string().default("untitled")

// Strip unknown keys from objects
schema.strip()
```
