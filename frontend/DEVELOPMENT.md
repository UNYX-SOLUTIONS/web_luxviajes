# 📚 Development Setup for Lux Viajes Frontend

## ✅ Requirements

- Node.js 18+ (recomendado 20+)
- pnpm 9+ (package manager)
- VS Code o editor similar

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Environment
```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your values (optional for local development)
```

### 3. Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📂 Project Structure

```
src/
├── app/                 # Next.js App Router (pages and routes)
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── common/         # Reusable components (Button, Card, etc)
│   └── sections/       # Page section components
├── constants/          # Application constants
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helpers
│   ├── api.ts         # API fetch wrapper
│   ├── env.ts         # Environment variables
│   ├── logger.ts      # Logger utility
│   └── routes.ts      # Route constants
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🛠️ Available Scripts

```bash
# Development
pnpm dev           # Start development server

# Building
pnpm build         # Build for production
pnpm start         # Start production server

# Linting
pnpm lint          # Run ESLint

# Type checking
pnpm type-check    # Run TypeScript type check
```

## 📖 Key Technology Stack

- **Next.js 16.2.3** - React framework
- **React 19.2.4** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **pnpm** - Fast package manager

## 💡 Development Tips

### Creating a New Page

1. Create a folder in `src/app/` with a `page.tsx` file:
```tsx
export default function Page() {
  return <h1>New Page</h1>;
}
```

2. Access it at `/new-page`

### Creating a Component

1. Create component in `src/components/common/` or `src/components/sections/`
2. Export it from the index file:
```tsx
// src/components/common/index.ts
export { default as MyComponent } from './MyComponent';
```

### Adding API Routes

1. Create a file in `src/app/api/[route]/route.ts`
2. Export handlers: `GET`, `POST`, `PUT`, `DELETE`

```tsx
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}
```

### Using Environment Variables

- **Public** (accessible in browser): `NEXT_PUBLIC_*`
- **Private** (server-only): No prefix

Use `src/lib/env.ts` to type-check them.

## 🔍 Error Handling

- **404 Pages**: Edit `src/app/not-found.tsx`
- **Error Pages**: Edit `src/app/error.tsx`
- **API Errors**: Use the logger utility in `src/lib/logger.ts`

## 🚨 Common Issues & Solutions

### Issue: Changes not reflecting
**Solution**: Clear `.next` folder and restart dev server
```bash
rm -rf .next
pnpm dev
```

### Issue: TypeScript errors after changes
**Solution**: Run type check
```bash
pnpm type-check
```

### Issue: Tailwind styles not applying
**Solution**: Make sure class name is referenced correctly (no template literals in class)

## 📚 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ✨ Next Steps

1. Start with `pnpm dev`
2. Edit `src/app/page.tsx` to create your content
3. Add routes in `src/app/` directory
4. Create components in `src/components/`
5. Configure environment variables in `.env.local`

## 📝 Notes

- **Hot Reload**: Changes are automatically reflected in the browser
- **API Routes**: Run server-side code without needing a separate backend
- **Image Optimization**: Use Next.js Image component for automatic optimization
- **Type Safety**: TypeScript is configured for strict checking

Happy coding! 🎉
