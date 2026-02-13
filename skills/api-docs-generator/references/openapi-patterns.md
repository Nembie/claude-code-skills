# OpenAPI Patterns Reference

## Zod to OpenAPI Type Mapping

| Zod | OpenAPI |
|---|---|
| `z.string()` | `{ type: "string" }` |
| `z.string().email()` | `{ type: "string", format: "email" }` |
| `z.string().url()` | `{ type: "string", format: "uri" }` |
| `z.string().uuid()` | `{ type: "string", format: "uuid" }` |
| `z.string().cuid()` | `{ type: "string" }` |
| `z.string().min(n)` | `{ type: "string", minLength: n }` |
| `z.string().max(n)` | `{ type: "string", maxLength: n }` |
| `z.string().regex(r)` | `{ type: "string", pattern: "..." }` |
| `z.number()` | `{ type: "number" }` |
| `z.number().int()` | `{ type: "integer" }` |
| `z.number().min(n)` | `{ type: "number", minimum: n }` |
| `z.number().max(n)` | `{ type: "number", maximum: n }` |
| `z.boolean()` | `{ type: "boolean" }` |
| `z.array(T)` | `{ type: "array", items: T }` |
| `z.object({...})` | `{ type: "object", properties: {...} }` |
| `z.enum(["a","b"])` | `{ type: "string", enum: ["a", "b"] }` |
| `z.literal("x")` | `{ type: "string", enum: ["x"] }` |
| `z.nullable()` | Add `nullable: true` |
| `z.optional()` | Remove from `required` array |
| `z.coerce.number()` | `{ type: "number" }` (note: coercion is runtime-only) |
| `z.coerce.date()` | `{ type: "string", format: "date-time" }` |
| `z.union([A, B])` | `{ oneOf: [A, B] }` |
| `z.discriminatedUnion("type", [...])` | `{ oneOf: [...], discriminator: { propertyName: "type" } }` |
| `z.record(K, V)` | `{ type: "object", additionalProperties: V }` |

## Next.js App Router Path Conventions

| Convention | OpenAPI equivalent |
|---|---|
| `[id]` | `{id}` |
| `[...slug]` | `{slug}` — document as: "Catch-all segment. Multiple path segments separated by `/`." |
| `[[...slug]]` | Same as catch-all but optional |
| `(group)` | Route groups don't appear in URL path — skip them |

## Security Schemes

### Bearer JWT (most common)

```yaml
securitySchemes:
  bearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT
```

### Cookie Session (NextAuth / Auth.js)

```yaml
securitySchemes:
  cookieAuth:
    type: apiKey
    in: cookie
    name: next-auth.session-token
```

### API Key

```yaml
securitySchemes:
  apiKeyAuth:
    type: apiKey
    in: header
    name: X-API-Key
```

## Pagination Response Pattern

```yaml
PaginatedResponse:
  type: object
  properties:
    data:
      type: array
      items: { $ref: "#/components/schemas/Item" }
    pagination:
      type: object
      properties:
        page: { type: integer }
        limit: { type: integer }
        total: { type: integer }
        totalPages: { type: integer }
```

## Tags from Folder Structure

Group endpoints by the first path segment after `/api/`:

```yaml
tags:
  - name: users
    description: User management
  - name: posts
    description: Post operations
```

Map each endpoint to its tag based on path: `/api/users/...` → tag `users`.
