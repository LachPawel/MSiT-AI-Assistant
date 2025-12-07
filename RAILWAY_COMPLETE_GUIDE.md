# 🚀 Railway Deployment - Complete Guide

## Overview
This document provides everything needed to deploy your MSiT AI Assistant to Railway.app in under 10 minutes.

---

## 📋 Pre-Deployment Checklist

### Code Ready?
- [x] Backend has `Procfile` and `railway.json`
- [x] Backend has `package.json` with `npm run start` script
- [x] Frontend has `vite.config.ts` configured
- [x] Frontend `.env.production` ready
- [x] GitHub repository is up to date

### Credentials Ready?
- [ ] Supabase URL and Keys (from supabase.com)
- [ ] OpenAI API Key (from platform.openai.com)
- [ ] Exa.ai Key (optional, from exa.ai)

### Other?
- [ ] Railway account created (railway.app)
- [ ] GitHub connected to Railway
- [ ] Database migrations ready

---

## 🎯 Deployment Architecture

```
┌─────────────────────────────────────┐
│   Frontend (Vue 3 + Vite)           │
│   https://your-app.railway.app      │
└────────────────┬────────────────────┘
                 │ API Requests
                 ▼
┌─────────────────────────────────────┐
│   Backend (Node.js + Express)       │
│   https://your-api.railway.app      │
└────────────────┬────────────────────┘
                 │ Database Queries
                 ▼
┌─────────────────────────────────────┐
│   Supabase PostgreSQL               │
│   (Hosted separately)               │
└─────────────────────────────────────┘
```

---

## 🔧 Step-by-Step Deployment

### PHASE 1: Backend Deployment (5 minutes)

#### Step 1.1: Create Backend Project
```
1. Go to https://railway.app/dashboard
2. Click "New Project" button
3. Choose "Deploy from GitHub"
4. Select your MSiT-AI-Assistant repository
5. Choose root directory: /backend
6. Click "Deploy"
```

#### Step 1.2: Configure Build Settings
```
Dashboard → Backend Service → Build
- Build Command: npm install && npm run build
- Start Command: npm run start
- Root Directory: /backend
```

#### Step 1.3: Add Environment Variables
```
Dashboard → Backend Service → Variables

Add these variables:
╔═══════════════════════════════════════════╗
║ NODE_ENV                  = production    ║
║ PORT                      = 3001          ║
║ SUPABASE_URL             = [paste your]  ║
║ SUPABASE_ANON_KEY        = [paste your]  ║
║ SUPABASE_SERVICE_KEY     = [paste your]  ║
║ OPENAI_API_KEY           = [paste your]  ║
║ EXA_API_KEY              = [optional]    ║
╚═══════════════════════════════════════════╝
```

#### Step 1.4: Wait for Deployment
- Railway builds automatically
- Takes ~3 minutes
- Watch logs in "Build & Logs" tab
- Status changes to ✅ "Deployed" when complete

#### Step 1.5: Get Backend URL
```
Backend Service → Settings
Copy the "Railway URL" at the top
Example: https://msit-backend-prod-12abc.railway.app

📌 SAVE THIS URL - needed for frontend!
```

#### Step 1.6: Test Backend
```bash
# Open in browser or terminal:
curl https://your-backend-url/cases

# Should return JSON array of cases (or empty array)
# If you get an error, check logs in Railway
```

---

### PHASE 2: Frontend Deployment (5 minutes)

#### Step 2.1: Update Frontend Config
```
File: frontend/.env.production

Update line:
VITE_API_URL=https://your-backend-url-here.railway.app
         ↑
    Use the URL you got from Step 1.5
```

#### Step 2.2: Commit and Push
```bash
git add .
git commit -m "Update railway deployment config"
git push origin main
```

#### Step 2.3: Create Frontend Project
```
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Choose "Deploy from GitHub"
4. Select MSiT-AI-Assistant repository
5. Choose root directory: /frontend
6. Click "Deploy"
```

#### Step 2.4: Configure Build Settings
```
Dashboard → Frontend Service → Build
- Build Command: npm install && npm run build
- Root Directory: /frontend
```

#### Step 2.5: Add Environment Variables
```
Dashboard → Frontend Service → Variables

Add these variables:
╔═══════════════════════════════════════════╗
║ VITE_API_URL = https://your-backend-url  ║
║ NODE_ENV = production                    ║
╚═══════════════════════════════════════════╝
```

#### Step 2.6: Wait for Deployment
- Takes ~3 minutes
- Watch logs in "Build & Logs" tab
- Status changes to ✅ "Deployed"

#### Step 2.7: Get Frontend URL
```
Frontend Service → Settings
Copy the "Railway URL"
Example: https://msit-app-frontend-12def.railway.app

🎉 THIS IS YOUR PUBLIC APP URL!
```

---

## ✅ Post-Deployment Testing

### Test 1: Frontend Loads
```
1. Visit: https://your-frontend-url
2. Should see login form / home page
3. No console errors (check DevTools → Console)
```

### Test 2: Create Test Case
```
1. Fill in form:
   - Title: "Test Case"
   - Description: "This is a test"
   - Name: "Test Organization"
   - NIP: "1234567890"
2. Click "Utwórz i Analizuj z AI"
3. Wait for AI analysis
4. Should see risk score and draft decision
```

### Test 3: Officer Dashboard
```
1. Visit: https://your-frontend-url/officer
2. Should see statistics cards
3. Should see all cases in table
4. Search functionality should work
```

### Test 4: Chat Interface
```
1. In case detail view, scroll to chat
2. Ask AI a question
3. Should get response within 5 seconds
4. Chat history should appear
```

---

## 🔗 Connecting Frontend & Backend

The connection happens automatically when you:
1. ✅ Set `VITE_API_URL` in frontend environment
2. ✅ Deploy frontend with that variable
3. ✅ Frontend makes API calls to that URL

If connections fail:
1. Check frontend console for errors
2. Verify `VITE_API_URL` is correct and starts with `https://`
3. Check backend is running (visit backend URL in browser)
4. Check backend logs for errors

---

## 🗄️ Database Setup (One-time)

The database doesn't go on Railway - it stays on Supabase.

**ONE-TIME SETUP:**
```
1. Go to your Supabase project
2. Click "SQL Editor"
3. New query
4. Copy entire content of: database/schema.sql
5. Paste and run
6. Then run: database/migration.sql
```

---

## 📊 Monitoring & Maintenance

### View Logs
```
Railway Dashboard → [Service] → Logs
- Shows real-time application output
- Useful for debugging issues
- Scroll to see history
```

### View Metrics
```
Railway Dashboard → [Service] → Metrics
- CPU Usage
- Memory Usage
- Request Count
- Response Time
```

### Redeploy Manually
```
Railway Dashboard → [Service] → Deploy
Click "Trigger Deployment" button
Useful if you made changes and auto-deploy is off
```

### Auto-Redeploy Settings
```
Railway Dashboard → [Service] → Settings
- "Auto-deploy on push": Toggle to enable/disable
- Enabled by default (recommended)
- Auto-redeploys when you push to main branch
```

---

## 🚨 Common Issues & Solutions

### Issue: Backend deployment fails
```
Solution:
1. Check logs: Railway → Backend → Logs
2. Verify npm scripts work locally:
   cd backend && npm run build && npm start
3. Check package.json has all dependencies
4. Ensure all environment variables are set
```

### Issue: Frontend shows blank page
```
Solution:
1. Check browser console for errors: F12 → Console
2. Verify VITE_API_URL is correct
3. Check backend is running (test with curl)
4. Clear browser cache: Ctrl+Shift+Delete
5. Redeploy frontend
```

### Issue: API requests fail (CORS error)
```
Solution:
1. Verify backend has CORS enabled (it does by default)
2. Check VITE_API_URL matches deployed backend URL
3. Look at backend logs for errors
4. Ensure Supabase credentials are correct in backend
```

### Issue: Database not found
```
Solution:
1. Run migration.sql in Supabase SQL Editor first
2. Verify SUPABASE_URL is correct
3. Verify SUPABASE_ANON_KEY is valid
4. Check Supabase project exists and is active
```

### Issue: AI analysis fails
```
Solution:
1. Check OPENAI_API_KEY is set correctly
2. Verify API key still has credit
3. Check backend logs for OpenAI error messages
4. Try again - might be API rate limit
```

---

## 📈 Scaling Tips

As your app grows:

### Increase Resources
```
Railway Dashboard → [Service] → Settings
Increase allocated memory/CPU if needed
```

### Database Performance
```
Supabase Dashboard → Indexes
Add indexes on frequently queried columns
```

### Caching
```
Add Redis for caching API responses
Create new Redis service in Railway
```

---

## 🎯 What to Share

After successful deployment, share these with judges/users:

```
📱 Live Application:
   https://your-frontend-xxxx.railway.app

🔌 API Endpoint:
   https://your-backend-xxxx.railway.app

📦 Source Code:
   https://github.com/LachPawel/MSiT-AI-Assistant

📚 Documentation:
   - README.md
   - ARCHITECTURE.md
   - SECURITY.md
   - DEPLOYMENT_RAILWAY.md
```

---

## 💡 Pro Tips

1. **Custom Domain**: Railway supports custom domains (paid)
2. **Environment Secrets**: Use Railway Variables for all secrets
3. **Local Testing**: Run `npm run dev` locally before deploying
4. **Blue-Green Deploy**: Railway handles this automatically
5. **Webhooks**: Set up GitHub notifications for deployments
6. **Auto-scaling**: Premium feature, but good for high traffic

---

## 🎓 Learning Resources

- Railway Docs: https://docs.railway.app
- Vue 3 Deployment: https://vitejs.dev/guide/build.html
- Node.js Best Practices: https://nodejs.org/en/docs/guides/nodejs-web-app-without-a-framework/
- Express.js: https://expressjs.com/

---

## 📞 Support

If you get stuck:
1. Check Railway logs first
2. Read error messages carefully
3. Check this guide's troubleshooting section
4. Visit Railway Discord: https://discord.gg/railway
5. Check application GitHub issues

---

## ✨ Success Criteria

Your deployment is successful when:
- [x] Frontend loads without errors
- [x] Can create a new case
- [x] AI analysis runs and shows results
- [x] Officer dashboard displays all cases
- [x] Chat interface works
- [x] URLs are shareable and public
- [x] App is responsive on mobile

---

## 🎉 You're Live!

Congratulations! Your MSiT AI Assistant is now deployed and accessible 24/7!

**Next steps:**
1. Test thoroughly with real data
2. Record demo video (3 min max)
3. Create PDF presentation (10 slides max)
4. Submit to hackathon with your live URLs
5. Celebrate! 🎊
