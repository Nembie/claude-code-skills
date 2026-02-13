# Env Configuration Patterns

## T3 Env Setup for Next.js

### Installation

```bash
npm install @t3-oss/env-nextjs zod
```

### Server vs Client Separation

- **Server variables**: Only accessible in server components, API routes, and middleware. Never prefixed with `NEXT_PUBLIC_`.
- **Client variables**: Must be prefixed with `NEXT_PUBLIC_`. Accessible everywhere, including browser bundles. Never put secrets here.

### Import Pattern

```typescript
// Always import env from the schema — never use process.env directly
import { env } from "@/env";

// GOOD
const dbUrl = env.DATABASE_URL;

// BAD — bypasses validation, no type safety
const dbUrl = process.env.DATABASE_URL;
```

### Validation on Build

Add to `next.config.js` to validate env at build time:

```javascript
// next.config.js
import "./env.js"; // Triggers validation on import

/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

## Common Env Variable Catalog

### Database

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
DATABASE_URL_UNPOOLED="postgresql://user:password@localhost:5432/mydb"  # Direct connection for migrations
SHADOW_DATABASE_URL="postgresql://user:password@localhost:5432/mydb_shadow"  # Prisma shadow DB
```

### Authentication

```bash
NEXTAUTH_SECRET="openssl-rand-base64-32-output"
NEXTAUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="google-oauth-client-id"
AUTH_GOOGLE_SECRET="google-oauth-client-secret"
AUTH_GITHUB_ID="github-oauth-client-id"
AUTH_GITHUB_SECRET="github-oauth-client-secret"
```

### Email

```bash
SMTP_HOST="smtp.resend.com"
SMTP_PORT="587"
SMTP_USER="resend"
SMTP_PASS="re_..."
EMAIL_FROM="noreply@example.com"
# Or using Resend API directly
RESEND_API_KEY="re_..."
```

### Storage

```bash
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
S3_BUCKET="my-bucket"
# Or using Uploadthing / Cloudinary
UPLOADTHING_SECRET="sk_live_..."
CLOUDINARY_URL="cloudinary://..."
```

### Payments

```bash
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Monitoring

```bash
SENTRY_DSN="https://...@sentry.io/..."
SENTRY_AUTH_TOKEN="sntrys_..."
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."
```

### Feature Flags

```bash
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
NEXT_PUBLIC_MAINTENANCE_MODE="false"
```

## Security Checklist

### Must be in .gitignore

```gitignore
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### Must NOT be in .env.example

- Real API keys, tokens, or secrets
- Production database connection strings
- OAuth client secrets
- Webhook signing secrets
- Any value that grants access to a real service

### Must be in .env.example (with placeholders)

- Every variable referenced in code
- Descriptive placeholder values
- Comments explaining how to obtain each value
- Default values for optional variables

### Deployment Checklist

- [ ] All required variables are set in production environment
- [ ] `NEXTAUTH_URL` matches the production domain
- [ ] `NODE_ENV` is set to `production`
- [ ] No test/development API keys in production
- [ ] Secrets are managed via secrets manager (not plain env files)
- [ ] `.env` files are NOT included in Docker images
