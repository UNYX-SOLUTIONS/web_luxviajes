@echo off
REM Development setup script for Windows
echo 🚀 Setting up Lux Viajes Frontend...

REM Install dependencies
echo 📦 Installing dependencies...
call pnpm install

REM Create .env.local if it doesn't exist
if not exist .env.local (
  echo 📝 Creating .env.local...
  copy .env.example .env.local
)

REM Generate Next.js types
echo 🔧 Generating Next.js types...
call pnpm next build --dry-run

echo ✅ Setup complete!
echo.
echo 📖 Next steps:
echo 1. Run 'pnpm dev' to start the development server
echo 2. Open http://localhost:3000 in your browser
echo 3. Edit .env.local with your configuration
