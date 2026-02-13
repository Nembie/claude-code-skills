# claude-code-skills

<p align="center">
  <img width="741" height="179" alt="Claude Code Skills - Banner" src="https://github.com/user-attachments/assets/ddf470f5-ac94-4f13-89a3-9417531e7a9c" />
</p>
<p align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License MIT" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/skills-13-green?style=flat-square" alt="Skills: 13" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/agents-3-orange?style=flat-square" alt="Agents: 3" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
  </a>    
</p>
<p align="center">
  Production-grade skills and intelligent agents for Claude Code. Built for modern full-stack development.
</p>

## The Problem

Claude Code is powerful out of the box, but it doesn't know your stack conventions, forgets to check its own output, and treats every task as a one-shot. These skills add institutional knowledge, self-verification, and multi-step intelligence.

## Before / After

**Before (vanilla Claude Code):** "Review my Prisma queries" — Generic suggestions, misses N+1 in loops, no severity ranking.

**After (with prisma-query-optimizer):** Detects N+1 patterns in service files, flags missing indexes on foreign keys, suggests eager loading with exact `include` syntax, ranks by performance impact.

---

**Before:** "Scaffold a user profile feature" — Generates files with incompatible types between frontend and backend.

**After (with feature-scaffolder agent):** Generates shared types first, creates Zod validation from those types, builds API route and React component that both import from the same source of truth, runs type verification across all generated files.

---

**Before:** "Generate tests for my API route" — Tests that reference wrong imports or miss edge cases, left for you to fix.

**After (with test-generator):** Generates tests, runs them, fixes generation errors automatically (up to 3 retries), and flags any test failure that reveals a real bug in your source code.

## Skills

| Skill | What it does |
|-------|-------------|
| [prisma-query-optimizer](skills/prisma-query-optimizer) | Detect N+1 queries, missing indexes, over-fetching, and unbounded queries in Prisma code |
| [nextjs-route-generator](skills/nextjs-route-generator) | Scaffold Next.js App Router API routes with Zod validation, typed responses, and error handling |
| [typescript-refactorer](skills/typescript-refactorer) | Find and fix `any` types, missing discriminated unions, unsafe assertions, and implicit returns |
| [react-component-generator](skills/react-component-generator) | Generate accessible React components with TypeScript props, keyboard handling, and ARIA attributes |
| [code-reviewer](skills/code-reviewer) | Automated security, performance, and maintainability review with severity-based prioritization |
| [zod-schema-generator](skills/zod-schema-generator) | Generate Zod schemas from Prisma models, TypeScript interfaces, or JSON examples |
| [test-generator](skills/test-generator) | Generate and self-verify unit/integration tests for routes, components, hooks, and utilities |
| [git-commit-composer](skills/git-commit-composer) | Generate conventional commit messages from staged git changes |
| [prisma-migration-reviewer](skills/prisma-migration-reviewer) | Review SQL migrations for data loss risks, downtime, and missing indexes before deployment |
| [env-config-validator](skills/env-config-validator) | Validate env files, detect missing variables, and auto-generate typed env schemas |
| [db-seed-generator](skills/db-seed-generator) | Generate realistic seed data from a Prisma schema with correct relation ordering |
| [api-docs-generator](skills/api-docs-generator) | Generate OpenAPI 3.1 specs from existing Next.js API routes |
| [error-boundary-generator](skills/error-boundary-generator) | Scan a React app and generate error boundaries with typed fallback UIs where they're missing |

## Agents

Agents orchestrate multiple skills with branching logic — they stop on critical issues, skip irrelevant steps, and verify their own output.

| Agent | What it does |
|-------|-------------|
| [full-stack-reviewer](agents/full-stack-reviewer) | Runs code review first; if critical security issues are found, stops and reports them immediately instead of continuing. Otherwise runs Prisma + TypeScript analysis and produces a deduplicated report. |
| [feature-scaffolder](agents/feature-scaffolder) | Generates shared types first as a single source of truth, then creates Zod schemas, API routes, and React components that all import from the same types. Verifies cross-file imports before delivering. |
| [bug-fixer](agents/bug-fixer) | Iteratively investigates bugs — widens search if root cause is unclear, asks for confirmation before fixing, generates and runs regression tests, reports confidence level. |

## Quick Start

Copy a skill to your Claude Code skills directory:

```bash
cp -r skills/prisma-query-optimizer ~/.claude/skills/
```

Or symlink from the cloned repo:

```bash
git clone https://github.com/yourorg/claude-code-skills.git
ln -s $(pwd)/claude-code-skills/skills/prisma-query-optimizer ~/.claude/skills/
```

Skills are automatically available once placed in `~/.claude/skills/`.

## Configuration

Edit `config/defaults.md` to match your stack. Every skill reads this file and adapts its output accordingly.

```
orm: Prisma                    # or Drizzle, TypeORM, Kysely
api: Next.js App Router        # or tRPC, Express
testing: Vitest                # or Jest
validation: Zod                # or Valibot, ArkType
styling: Tailwind CSS          # or CSS Modules, styled-components
components: none               # or shadcn/ui, Radix, MUI
package-manager: pnpm          # or npm, yarn, bun
database: PostgreSQL           # or MySQL, SQLite
```

Change a value and all skills automatically adjust their generated code, imports, and patterns.

## Try It

The `examples/demo-inputs/` directory contains realistic code samples with subtle, production-like issues. Run any skill against them:

```
Review user-service.ts for query performance issues
Generate tests for checkout-route.ts
Validate .env.example and generate a typed env schema
Review product-list.tsx for accessibility and performance
Analyze schema-types.ts for type safety improvements
```

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on creating new skills.

## License

MIT — see [LICENSE](LICENSE) for details.
