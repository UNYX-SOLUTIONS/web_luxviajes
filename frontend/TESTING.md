# Blog & Hero Section Integration - Test Guide

## Running Tests

```bash
# Install dependencies (if not already installed)
pnpm install
# or
npm install

# Run all tests
pnpm test
# or
npm run test

# Run tests in watch mode
pnpm test:watch
# or
npm run test:watch

# Run tests with coverage report
pnpm test:coverage
# or
npm run test:coverage
```

## Test Structure

```
frontend/src/test/
├── services/
│   └── strapi.test.ts          # Unit tests for Strapi service layer
├── hooks/
│   └── useBlogData.test.ts     # Unit tests for useBlogData hook
└── api/
    ├── blog.test.ts             # Unit tests for /api/blog route handler
    └── hero.test.ts             # Unit tests for /api/hero route handler
```

## What the Tests Cover

### Strapi Service Tests (`strapi.test.ts`)
- `getStrapiData` - Generic fetch with auth token handling
- `getBlogPosts` - Fetching and transforming blog post collections
- `getBlogPostBySlug` - Fetching a single post by slug
- `getBlogPage` - Fetching blog page data including hero section
- `getHeroSection` - Fetching hero section data
- Error handling for 401 (auth), 403 (forbidden), 404, and network errors
- Default value fallbacks (author, readTime, etc.)

### Hook Tests (`useBlogData.test.ts`)
- Loading state management
- Successful data fetching and caching
- 404 error handling (endpoint unavailable)
- 401 authentication error handling
- 429 rate limit handling
- Network error handling with stale cache fallback
- Manual refetch functionality

### Blog API Route Tests (`blog.test.ts`)
- Returning all posts with hero data
- Returning a single post by slug parameter
- 404 response when post not found
- 401 authentication error propagation
- 403 access forbidden error propagation
- 500 unexpected error handling
- Empty state when blog page data is missing

### Hero API Route Tests (`hero.test.ts`)
- Returning hero section data
- 404 when hero section not configured
- 401 authentication error handling
- 500 unexpected error handling

## Auth Token Configuration

Set the environment variable `NEXT_PUBLIC_STRAPI_API_TOKEN` in `.env.local`:

```bash
NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_api_token_here
```

The token is automatically included in all Strapi API requests via the auth header.
When no token is set, requests proceed without authentication (public content).

## Test Coverage

Tests target 85%+ coverage across:
- `src/services/strapi.ts` - Blog and Hero service functions
- `src/app/api/blog/route.ts` - Blog API route handler
- `src/app/api/hero/route.ts` - Hero API route handler
- `src/hooks/useBlogData.ts` - Blog data fetching hook

## Key Architecture Patterns

1. **Service Layer** (`src/services/strapi.ts`): All Strapi communication centralized here with auth token support
2. **API Routes** (`src/app/api/*/route.ts`): Next.js route handlers that delegate to service layer
3. **Hooks** (`src/hooks/`): React hooks that call API routes
4. **Types** (`src/types/index.ts`): TypeScript interfaces for all data models

## Troubleshooting

If tests fail with module resolution errors:
1. Delete `node_modules/.cache` and `node_modules/.vite`
2. Run `pnpm install` again
3. Ensure `NEXT_PUBLIC_STRAPI_API_URL` is set to your Strapi instance URL

If coverage is below 85%:
1. Check `coverage/lcov-report/index.html` for a visual report
2. Add tests for any uncovered error paths
3. Focus on the `strapi.test.ts` service tests first