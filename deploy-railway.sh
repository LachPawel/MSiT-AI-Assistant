#!/bin/bash

# Railway Deployment Quick Setup Script
# Run this from the project root directory

echo "🚀 MSiT AI Assistant - Railway Deployment Setup"
echo "================================================\n"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "✅ Railway CLI ready!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Login to Railway:"
echo "   railway login"
echo ""
echo "2. Create a new project (or link existing):"
echo "   railway init"
echo ""
echo "3. Set environment variables:"
echo "   railway variables set SUPABASE_URL=your_url"
echo "   railway variables set SUPABASE_ANON_KEY=your_key"
echo "   railway variables set OPENAI_API_KEY=your_key"
echo ""
echo "4. Deploy backend:"
echo "   cd backend && railway up"
echo ""
echo "5. Get backend URL and update frontend:"
echo "   cd ../frontend"
echo "   echo 'VITE_API_URL=https://your-backend-url' >> .env.production"
echo ""
echo "6. Deploy frontend:"
echo "   railway up"
echo ""
echo "📖 Full guide: See DEPLOYMENT_RAILWAY.md"
