# Seed Patterns Reference

## Dependency Ordering Algorithm

1. Build adjacency list: for each model, collect models it depends on via required `@relation` fields.
2. Topological sort using Kahn's algorithm (BFS with in-degree tracking).
3. If a cycle is detected:
   - Find the edge creating the cycle (usually a self-referencing or mutual relation).
   - Break the cycle by making one side a two-pass operation: create with the FK set to `null` (if optional), then update.
   - If both sides are required, one must use `create` with nested `create` syntax.

## Realistic Data Patterns

### Names

Use a diverse set of names reflecting different cultural backgrounds:

```
Elena Rodriguez, Marcus Chen, Priya Patel, James Okafor, Sofia Andersen,
Kenji Tanaka, Amira Hassan, Lucas Weber, Fatima Al-Rashid, David Kim
```

### Company/Organization Names

```
Acme Corp, Northwind Traders, Contoso Ltd, Tailspin Toys, Globex Inc
```

### Addresses

Always use obviously fake addresses:

```
123 Oak Street, Springfield, IL 62701
456 Elm Avenue, Portland, OR 97201
789 Pine Road, Austin, TX 78701
```

### Dates

Spread `createdAt` dates across the last 90 days for realistic chronological data. Use `new Date("2024-01-15T10:30:00Z")` style for deterministic seeds, or `subDays(new Date(), n)` for relative dates.

### Prices

Use realistic price points: `9.99`, `29.00`, `49.99`, `99.00`, `149.99`, `299.00`. Avoid round numbers for everything — real data has cents.

### Statuses and Enums

Distribute across all values, weighted realistically:
- `ACTIVE` (60%), `INACTIVE` (20%), `PENDING` (15%), `SUSPENDED` (5%)
- `PUBLISHED` (70%), `DRAFT` (25%), `ARCHIVED` (5%)

## Self-Referencing Models

```typescript
// Category with parent (tree structure)
const electronics = await prisma.category.create({
  data: { name: "Electronics" },
});
const phones = await prisma.category.create({
  data: { name: "Phones", parentId: electronics.id },
});
```

## Many-to-Many (Implicit)

```typescript
const tag1 = await prisma.tag.create({ data: { name: "typescript" } });
const tag2 = await prisma.tag.create({ data: { name: "prisma" } });

await prisma.post.create({
  data: {
    title: "Getting started with Prisma",
    tags: { connect: [{ id: tag1.id }, { id: tag2.id }] },
  },
});
```

## Performance Tips

- Use `createMany` instead of individual `create` calls for models without nested relations.
- Wrap everything in `prisma.$transaction([...])` for atomicity and speed.
- For 100+ records, batch `createMany` in chunks of 50 to avoid query size limits.
- Always `deleteMany` in reverse dependency order before seeding to avoid FK constraint violations.
- Use `skipDuplicates: true` with `createMany` when re-running seeds.
