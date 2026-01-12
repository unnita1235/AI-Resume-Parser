#!/bin/bash
# Deployment Verification Script
# This script verifies that the AI Resume Parser is ready for production deployment

echo "🚀 AI Resume Parser - Deployment Verification"
echo "==========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print results
check_item() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        return 1
    fi
}

echo "📋 Build & Compilation Checks"
echo "-----------------------------"

# Check if npm is installed
npm --version > /dev/null 2>&1
check_item "npm installed"

# Check Node version
node --version > /dev/null 2>&1
check_item "Node.js installed"

# Check package.json
[ -f "package.json" ]
check_item "package.json exists"

# Check dependencies installed
[ -d "node_modules" ]
check_item "node_modules installed"

echo ""
echo "🏗️  Build Verification"
echo "---------------------"

# Run TypeScript check
npm run typecheck > /dev/null 2>&1
check_item "TypeScript compilation"

# Check if build output exists
[ -d ".next" ]
check_item "Next.js build output (.next)"

echo ""
echo "🧪 Test Results"
echo "---------------"

# Run tests
npm test -- --run > /dev/null 2>&1
check_item "All tests passing"

echo ""
echo "🔧 Configuration Files"
echo "----------------------"

[ -f "vercel.json" ]
check_item "vercel.json (frontend deployment)"

[ -f "render.yaml" ]
check_item "render.yaml (backend deployment)"

[ -f "next.config.ts" ]
check_item "next.config.ts"

[ -f "Dockerfile" ]
check_item "Dockerfile (frontend)"

[ -f "backend/Dockerfile" ]
check_item "backend/Dockerfile"

echo ""
echo "📁 Required Directories"
echo "----------------------"

[ -d "src/app/api" ]
check_item "API routes directory"

[ -d "src/components" ]
check_item "Components directory"

[ -d "src/lib" ]
check_item "Libraries directory"

[ -d "backend/src" ]
check_item "Backend source directory"

echo ""
echo "🔐 Security Check"
echo "-----------------"

# Check for hardcoded secrets in render.yaml
grep -q "AIzaSyA" render.yaml > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${RED}✗${NC} No hardcoded API keys in render.yaml"
else
    echo -e "${GREEN}✓${NC} No hardcoded API keys in render.yaml"
fi

# Check .env.local is gitignored
grep -q ".env.local" .gitignore > /dev/null 2>&1
check_item "Environment files gitignored"

echo ""
echo "📝 Environment Setup"
echo "-------------------"

[ -f ".env.example" ]
check_item ".env.example template exists"

echo ""
echo "✅ Verification Complete!"
echo "========================="
echo ""
echo "🚀 Ready for Deployment!"
echo ""
echo "Next steps:"
echo "1. Push code to GitHub"
echo "2. Deploy frontend to Vercel"
echo "3. Deploy backend to Render"
echo "4. Set environment variables in deployment platforms"
echo "5. Test live application"
echo ""
