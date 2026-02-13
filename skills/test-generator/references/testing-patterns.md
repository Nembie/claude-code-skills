# Testing Patterns Reference

## Vitest Setup for Next.js App Router

### vitest.config.ts

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**", "app/**", "lib/**"],
      exclude: ["**/*.test.*", "**/*.d.ts"],
    },
  },
});
```

### vitest.setup.ts

```typescript
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
```

## Mocking Prisma Client

Create a shared mock at `__mocks__/prisma.ts` or mock inline.

### Shared mock approach

```typescript
// lib/__mocks__/prisma.ts
import { beforeEach } from "vitest";
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";
import { type PrismaClient } from "@prisma/client";
import { prisma } from "../prisma";

vi.mock("../prisma", () => ({
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
```

### Usage in tests

```typescript
import { prismaMock } from "@/lib/__mocks__/prisma";

it("should find user by email", async () => {
  const mockUser = { id: "1", email: "test@example.com", name: "Test" };
  prismaMock.user.findUnique.mockResolvedValue(mockUser);

  const result = await getUserByEmail("test@example.com");
  expect(result).toEqual(mockUser);
  expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
    where: { email: "test@example.com" },
  });
});
```

## Testing Authenticated Routes

### Mock next-auth / auth.js session

```typescript
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { auth } from "@/lib/auth";

describe("protected route", () => {
  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const response = await GET(new Request("http://localhost/api/protected"));
    expect(response.status).toBe(401);
  });

  it("should return data when authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", email: "test@example.com" },
    });
    const response = await GET(new Request("http://localhost/api/protected"));
    expect(response.status).toBe(200);
  });
});
```

## React Testing Library Best Practices

### Query Priority (most to least preferred)

1. `getByRole` — accessible to everyone (screen readers, users)
2. `getByLabelText` — good for form fields
3. `getByPlaceholderText` — if no label exists
4. `getByText` — for non-interactive elements
5. `getByDisplayValue` — current value of form elements
6. `getByAltText` — images
7. `getByTitle` — if nothing else works
8. `getByTestId` — last resort

### Common role queries

```typescript
screen.getByRole("button", { name: /submit/i });
screen.getByRole("textbox", { name: /email/i });
screen.getByRole("heading", { level: 2 });
screen.getByRole("link", { name: /home/i });
screen.getByRole("checkbox", { name: /agree/i });
screen.getByRole("alert");
screen.getByRole("dialog");
screen.getByRole("navigation");
```

### Async queries

```typescript
// Wait for element to appear
await screen.findByText(/success/i);

// Assert element is NOT present
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
```

## MSW Handler Patterns

### Setup

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ]);
  }),

  http.post("/api/users", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: "3", ...body }, { status: 201 });
  }),

  http.get("/api/users/:id", ({ params }) => {
    if (params.id === "404") {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }
    return HttpResponse.json({ id: params.id, name: "Test User" });
  }),
];
```

### Per-test overrides

```typescript
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";

it("should show error when API fails", async () => {
  server.use(
    http.get("/api/users", () => {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    })
  );

  render(<UserList />);
  await screen.findByText(/something went wrong/i);
});
```

## Database Test Fixtures

### Factory pattern

```typescript
// tests/factories/user.ts
import { faker } from "@faker-js/faker";

export function buildUser(overrides = {}) {
  return {
    id: faker.string.cuid2(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
```

### Cleanup strategy for integration tests

```typescript
import { prisma } from "@/lib/prisma";

afterEach(async () => {
  // Delete in dependency order (children before parents)
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
});
```

Or use transactions for automatic rollback:

```typescript
import { prisma } from "@/lib/prisma";

let tx: Awaited<ReturnType<typeof prisma.$transaction>>;

beforeEach(async () => {
  // Start a transaction that will be rolled back
  await prisma.$executeRaw`BEGIN`;
});

afterEach(async () => {
  await prisma.$executeRaw`ROLLBACK`;
});
```
