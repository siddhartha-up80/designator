#!/bin/bash

# Production Deployment Script for Designator

set -e

echo "🚀 Starting Designator Production Deployment..."

# Check if required environment variables are set
required_vars=(
  "DATABASE_URL"
  "NEXTAUTH_SECRET"
  "GOOGLE_CLIENT_ID"
  "GOOGLE_CLIENT_SECRET"
  "GEMINI_API_KEY"
  "CASHFREE_APP_ID"
  "CASHFREE_SECRET_KEY"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Error: $var is not set"
    exit 1
  fi
done

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️ Setting up database..."
npx prisma db push

# Seed database (if needed)
echo "🌱 Seeding database..."
npx prisma db seed

# Build the application
echo "🏗️ Building application..."
npm run build

echo "🎉 Deployment complete!"
echo "📝 Don't forget to:"
echo "   • Set up SSL certificates"
echo "   • Configure domain settings"
echo "   • Set up monitoring"
echo "   • Configure backup systems"
