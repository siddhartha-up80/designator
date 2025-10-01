#!/bin/bash

echo "================================================"
echo "Prisma Setup Script"
echo "================================================"
echo ""

echo "Step 1: Checking environment..."
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found!"
    echo "Please create .env file with required variables."
    echo "See .env.example for reference."
    exit 1
fi

echo "✅ .env file found"
echo ""

echo "Step 2: Generating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ ERROR: Failed to generate Prisma client."
    echo "Try closing all Node processes and try again."
    exit 1
fi

echo ""
echo "Step 3: Pushing schema to database..."
npx prisma db push
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ ERROR: Failed to push schema to database."
    echo "Check your DATABASE_URL in .env file."
    exit 1
fi

echo ""
echo "================================================"
echo "✅ SUCCESS! Prisma is set up correctly."
echo "================================================"
echo ""
echo "You can now run: npm run dev"
echo ""
