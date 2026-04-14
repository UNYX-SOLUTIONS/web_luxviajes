#!/bin/bash

# Development setup script
echo "🚀 Setting up Lux Viajes Frontend..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local..."
  cp .env.example .env.local
fi

# Generate Next.js types
echo "🔧 Generating Next.js types..."
pnpm next build --dry-run

echo "✅ Setup complete!"
echo ""
echo "📖 Next steps:"
echo "1. Run 'pnpm dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Edit .env.local with your configuration"
