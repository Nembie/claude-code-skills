# Error Patterns Reference

## Error Boundary Placement Strategy

### Where Error Boundaries Add Value

- **Route segments**: Every `page.tsx` that fetches data or has dynamic content should have a sibling `error.tsx`.
- **Data-fetching components**: Components using `useQuery`, `useSWR`, `fetch`, or server-side data loading.
- **Third-party integrations**: Payment forms (Stripe), maps (Google Maps), rich text editors — anything that loads external scripts.
- **User-generated content renderers**: Markdown parsers, HTML sanitizers, media embeds.
- **Feature boundaries**: Major UI sections (sidebar, main content, modal) so one failure doesn't take down the entire page.

### Where Error Boundaries Are Unnecessary

- **Pure display components**: Static text, icons, layout wrappers.
- **Deeply nested leaf components**: A single button or input field doesn't need its own boundary.
- **Components already wrapped**: Don't double-wrap.

### Rule of Thumb

Add an error boundary at each level where a failure should be independently recoverable without losing the rest of the page.

## Next.js App Router Error Hierarchy

Errors bubble up through the route segment hierarchy:

```
app/
├── global-error.tsx     ← catches root layout errors (must include <html><body>)
├── error.tsx            ← catches errors in the root page
├── layout.tsx
├── page.tsx
├── dashboard/
│   ├── error.tsx        ← catches errors in dashboard and its children
│   ├── loading.tsx      ← Suspense boundary for dashboard
│   ├── layout.tsx
│   ├── page.tsx
│   └── settings/
│       ├── error.tsx    ← catches errors only in settings
│       ├── not-found.tsx
│       └── page.tsx
```

Key rules:
- `error.tsx` catches errors in `page.tsx` and child segments, **not** in the `layout.tsx` at the same level.
- To catch layout errors, place `error.tsx` in the **parent** segment.
- `global-error.tsx` is the only boundary that catches root layout errors.
- `not-found.tsx` handles `notFound()` calls from `next/navigation`.

## Fallback UI Patterns

### Minimal (for non-critical sections)

```tsx
<div role="alert">
  <p>Failed to load.</p>
  <button onClick={reset}>Retry</button>
</div>
```

### Informative (for main content)

```tsx
<div role="alert">
  <h2>Couldn't load your dashboard</h2>
  <p>This might be a temporary issue. Try refreshing.</p>
  <div>
    <button onClick={reset}>Try again</button>
    <a href="/support">Contact support</a>
  </div>
</div>
```

### Full-page (for global errors)

Include the error digest for support tickets. Never show stack traces to users.

## Error Logging Integration

### Console (default)

```tsx
useEffect(() => { console.error(error); }, [error]);
```

### Sentry

```tsx
useEffect(() => {
  Sentry.captureException(error, { extra: { digest: error.digest } });
}, [error]);
```

### Custom endpoint

```tsx
useEffect(() => {
  fetch("/api/error-report", {
    method: "POST",
    body: JSON.stringify({
      message: error.message,
      digest: error.digest,
      url: window.location.href,
    }),
  }).catch(() => {});
}, [error]);
```

## Reset Strategies

- **`reset()` function**: Re-renders the route segment. Works for transient errors (network timeouts, intermittent failures).
- **`router.refresh()`**: Refetches server components. Works for stale data errors.
- **`router.push("/")`**: Navigate away. Works for unrecoverable errors.
- **`window.location.reload()`**: Full page reload. Last resort.
