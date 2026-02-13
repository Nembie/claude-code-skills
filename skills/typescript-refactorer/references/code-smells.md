# TypeScript Code Smells Catalog

## Type System Violations

### The `any` Escape Hatch
**Severity:** Critical

`any` disables type checking entirely. Every `any` is a potential runtime error.

```typescript
// Smell
function merge(a: any, b: any): any {
  return { ...a, ...b };
}

// Fix: Use generics
function merge<T, U>(a: T, b: U): T & U {
  return { ...a, ...b };
}
```

### Type Assertions as Casts
**Severity:** Critical

Using `as` to force types instead of fixing the actual type.

```typescript
// Smell
const config = JSON.parse(data) as Config;

// Fix: Validate at runtime
import { z } from 'zod';
const configSchema = z.object({ /* ... */ });
const config = configSchema.parse(JSON.parse(data));
```

### The `object` Type
**Severity:** High

`object` is too broad to be useful.

```typescript
// Smell
function process(obj: object) { /* ... */ }

// Fix: Define the shape
interface Processable {
  id: string;
  process(): void;
}
function process(obj: Processable) { /* ... */ }
```

## Null Safety Issues

### Optional Chaining Overuse
**Severity:** Medium

Excessive `?.` hides structural problems.

```typescript
// Smell: Too many optionals indicate unclear data shape
const city = user?.address?.city?.name?.toLowerCase();

// Fix: Model the data correctly
interface User {
  address: Address | null;
}
interface Address {
  city: string; // Required when address exists
}
```

### Null vs Undefined Inconsistency
**Severity:** Medium

Mixing `null` and `undefined` creates confusion.

```typescript
// Smell
interface User {
  name: string | null;
  email: string | undefined;
  phone?: string;
}

// Fix: Pick one convention (prefer undefined with optional)
interface User {
  name: string;
  email?: string;
  phone?: string;
}
```

## Generic Misuse

### Unnecessary Generics
**Severity:** Low

Generics that don't provide value.

```typescript
// Smell: T is never constrained or used meaningfully
function log<T>(value: T): void {
  console.log(value);
}

// Fix: Just use unknown
function log(value: unknown): void {
  console.log(value);
}
```

### Missing Generic Constraints
**Severity:** Medium

Generics without constraints are too permissive.

```typescript
// Smell
function getProperty<T, K>(obj: T, key: K) {
  return obj[key]; // Error: K can't index T
}

// Fix: Add constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## Interface/Type Issues

### Interface vs Type Confusion
**Severity:** Low

Use interfaces for object shapes, types for unions/primitives.

```typescript
// Prefer interface for objects (extendable)
interface User {
  id: string;
  name: string;
}

// Prefer type for unions and computed types
type Status = 'active' | 'inactive';
type UserKeys = keyof User;
```

### Overly Specific Types
**Severity:** Low

Types that are too narrow reduce reusability.

```typescript
// Smell: Too specific
interface CreateUserButtonProps {
  onCreateUser: (name: string, email: string) => void;
}

// Fix: More general
interface ButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}
```

## Function Signatures

### Boolean Parameters
**Severity:** Medium

Boolean params make call sites unclear.

```typescript
// Smell: What does true mean?
processUser(user, true, false);

// Fix: Use options object
processUser(user, { sendEmail: true, validate: false });
```

### Too Many Parameters
**Severity:** Medium

More than 3 params should be an object.

```typescript
// Smell
function createUser(name: string, email: string, age: number, role: string, dept: string) {}

// Fix
interface CreateUserParams {
  name: string;
  email: string;
  age: number;
  role: string;
  department: string;
}
function createUser(params: CreateUserParams) {}
```

## Async Issues

### Missing Promise Types
**Severity:** High

Async functions should have explicit return types.

```typescript
// Smell: Inferred as Promise<any> if fetch fails
async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

// Fix: Explicit return type
async function getUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  return res.json() as Promise<User>;
}
```

### Unhandled Promise Rejections
**Severity:** High

Async code without error handling.

```typescript
// Smell
async function save() {
  await db.save(data); // Can throw
}

// Fix: Handle or propagate explicitly
async function save(): Promise<Result<void, DbError>> {
  try {
    await db.save(data);
    return { success: true };
  } catch (e) {
    return { success: false, error: toDbError(e) };
  }
}
```

## Enum Anti-patterns

### Numeric Enums
**Severity:** Medium

Numeric enums have surprising behavior.

```typescript
// Smell: Allows any number at runtime
enum Status { Active, Inactive }
const s: Status = 999; // No error!

// Fix: Use const objects or string enums
const Status = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
type Status = typeof Status[keyof typeof Status];
```

## Module Issues

### Barrel File Hell
**Severity:** Low

Re-exporting everything creates circular dependencies and slow builds.

```typescript
// Smell: index.ts that exports everything
export * from './user';
export * from './post';
export * from './comment';

// Fix: Import directly from source
import { User } from './models/user';
```

### Type-Only Imports
**Severity:** Low

Import types properly to help bundlers.

```typescript
// Smell: Imports value when only type is needed
import { User } from './types';

// Fix: Use type-only import
import type { User } from './types';
```
