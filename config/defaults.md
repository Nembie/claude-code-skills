# Stack Configuration

Edit these defaults to match your stack. Skills will read this file and adapt their output.

# ORM — used for database queries, schema, seeds, migrations
# Alternatives: Drizzle, TypeORM, Kysely
orm: Prisma

# API style — how backend routes are structured
# Alternatives: tRPC, Pages API routes, Express
api: Next.js App Router

# Testing framework — used for unit and integration tests
# Alternatives: Jest
testing: Vitest

# Validation library — used for runtime type checking and schema generation
# Alternatives: Valibot, ArkType
validation: Zod

# Styling — CSS approach used in components
# Alternatives: CSS Modules, styled-components
styling: Tailwind CSS

# Component library — pre-built UI components
# Alternatives: shadcn/ui, Radix, MUI
components: none

# Package manager — used for install and script commands
# Alternatives: npm, yarn, bun
package-manager: pnpm

# Database — the underlying database engine
# Alternatives: MySQL, SQLite
database: PostgreSQL
