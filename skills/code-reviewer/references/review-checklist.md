# Code Review Checklist

## Security

### Input Validation
- [ ] All user inputs validated and sanitized
- [ ] File uploads restricted by type and size
- [ ] URL parameters validated before use
- [ ] JSON bodies parsed with schema validation (Zod)

### Authentication & Authorization
- [ ] Protected routes check authentication
- [ ] Authorization verified for each resource access
- [ ] Tokens stored securely (httpOnly cookies)
- [ ] Session expiration implemented
- [ ] Password requirements enforced

### Data Protection
- [ ] Sensitive data not logged
- [ ] Passwords hashed (bcrypt, argon2)
- [ ] API keys in environment variables
- [ ] PII encrypted at rest
- [ ] Sensitive fields excluded from API responses

### Injection Prevention
- [ ] No string concatenation in queries
- [ ] Parameterized queries used
- [ ] No eval() or Function() with user input
- [ ] No dangerouslySetInnerHTML with unsanitized content
- [ ] File paths sanitized (no path traversal)

### HTTP Security
- [ ] CORS configured restrictively
- [ ] CSRF protection enabled
- [ ] Security headers set (CSP, X-Frame-Options)
- [ ] HTTPS enforced in production

## Performance

### Database
- [ ] Queries use indexes appropriately
- [ ] No N+1 query patterns
- [ ] Large queries paginated
- [ ] Connections pooled
- [ ] Expensive queries cached

### Frontend
- [ ] Images optimized and lazy-loaded
- [ ] Bundle size reasonable (code splitting)
- [ ] No unnecessary re-renders
- [ ] Lists use virtualization for large datasets
- [ ] Memoization used where beneficial

### API
- [ ] Responses paginated
- [ ] Heavy operations async/backgrounded
- [ ] Appropriate caching headers
- [ ] Compression enabled
- [ ] Rate limiting implemented

### Memory
- [ ] Event listeners cleaned up
- [ ] Subscriptions unsubscribed
- [ ] Large objects released when done
- [ ] No unbounded array growth

## Maintainability

### Code Structure
- [ ] Functions < 50 lines
- [ ] Files < 300 lines
- [ ] No deep nesting (max 3 levels)
- [ ] Single responsibility principle
- [ ] DRY (no copy-pasted blocks)

### Naming
- [ ] Variables describe content
- [ ] Functions describe action
- [ ] Consistent naming convention
- [ ] No abbreviations (except well-known: id, url, etc.)
- [ ] Boolean vars are questions (isActive, hasPermission)

### Types (TypeScript)
- [ ] No `any` types
- [ ] No type assertions without validation
- [ ] Interfaces for object shapes
- [ ] Explicit function return types
- [ ] Discriminated unions for state

### Documentation
- [ ] Complex logic has comments explaining WHY
- [ ] Public APIs have JSDoc
- [ ] README updated for new features
- [ ] Breaking changes documented

## Error Handling

### Error Types
- [ ] Errors not swallowed silently
- [ ] Specific error types caught
- [ ] User-friendly error messages
- [ ] Errors logged with context
- [ ] Stack traces not exposed to users

### Recovery
- [ ] Graceful degradation where possible
- [ ] Retry logic for transient failures
- [ ] Fallback values where appropriate
- [ ] Transaction rollback on failure

### Validation Errors
- [ ] Specific error messages per field
- [ ] Errors returned in consistent format
- [ ] HTTP status codes correct (400 vs 500)

## Testing

### Unit Tests
- [ ] Happy path tested
- [ ] Edge cases tested (null, empty, boundary)
- [ ] Error conditions tested
- [ ] Mocks used appropriately
- [ ] Tests are isolated

### Integration Tests
- [ ] API endpoints tested
- [ ] Database operations tested
- [ ] Authentication flows tested
- [ ] Error responses tested

### Coverage
- [ ] Critical paths have tests
- [ ] New code has tests
- [ ] Bug fixes include regression tests

## React Specific

### Hooks
- [ ] useEffect has dependency array
- [ ] useEffect has cleanup when needed
- [ ] useMemo/useCallback used appropriately
- [ ] Custom hooks follow rules of hooks

### State
- [ ] State lifted to appropriate level
- [ ] No prop drilling (use context or composition)
- [ ] Derived state not stored
- [ ] State updates batched when possible

### Rendering
- [ ] Keys used correctly in lists
- [ ] No array index as key for dynamic lists
- [ ] Conditional rendering handles all states
- [ ] Loading and error states shown

### Accessibility
- [ ] Semantic HTML used
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Focus management correct
- [ ] Keyboard navigation works

## Next.js Specific

### Data Fetching
- [ ] Server components used where possible
- [ ] Client components marked with 'use client'
- [ ] Data fetched at appropriate level
- [ ] Caching strategy defined

### Routing
- [ ] Dynamic routes validated
- [ ] Middleware used for auth
- [ ] Error boundaries in place
- [ ] Loading states implemented

### API Routes
- [ ] Request method checked
- [ ] Body validated with Zod
- [ ] Errors return proper status codes
- [ ] Response format consistent
