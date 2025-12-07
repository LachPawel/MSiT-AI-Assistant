# 🚀 Railway Deployment - Quick Start (5 Minutes)

## Step 1: Prepare Files ✅ DONE
Your project is ready! We've created:
- `backend/Procfile` - Start command
- `backend/railway.json` - Build configuration  
- `frontend/.env.production` - Frontend environment

## Step 2: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project

## Step 3: Deploy Backend (3 minutes)

### Via Railway Dashboard:
1. Click "New Project" → "Deploy from GitHub"
2. Select your repository
3. In settings, set root to: `/backend`
4. Click "Deploy"
5. Wait for build to complete

### Set Environment Variables:
In Railway Dashboard → Backend Service → Variables:
```
NODE_ENV=production
SUPABASE_URL=paste_your_supabase_url
SUPABASE_ANON_KEY=paste_your_key
SUPABASE_SERVICE_KEY=paste_your_service_key
OPENAI_API_KEY=paste_your_api_key
EXA_API_KEY=paste_your_exa_key (optional)
PORT=3001
```

### Get Backend URL:
- After deployment, Railway shows your URL
- Example: `https://msit-backend-prod-xxxxx.railway.app`
- **Copy this URL** for the next step

## Step 4: Deploy Frontend (2 minutes)

### Update Frontend Environment:
1. Open `frontend/.env.production`
2. Replace:
```
VITE_API_URL=https://msit-backend-prod-xxxxx.railway.app
```

### Deploy via Railway Dashboard:
1. Click "New Project" → "Deploy from GitHub"
2. Select your repository
3. In settings, set root to: `/frontend`
4. Add Variable: `VITE_API_URL=your-backend-url-here`
5. Click "Deploy"
6. Wait for build (~3 minutes)

## Step 5: Test Your Application ✅
1. Railway shows your frontend URL
2. Click it to open your app
3. Create test case → Run AI analysis
4. Visit `/officer` to see dashboard

---

## ✅ Verification Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Can create a new case
- [ ] Can run AI analysis
- [ ] Officer dashboard loads
- [ ] Chat works
- [ ] No console errors

---

## 🐛 Troubleshooting

### Backend fails to start?
```bash
cd backend
npm run build
npm run start
# If this fails locally, check package.json scripts
```

### Frontend shows blank page?
- Check browser DevTools → Console for errors
- Verify `VITE_API_URL` is correct
- Check frontend logs in Railway

### API calls fail?
- Verify backend URL in frontend environment
- Check backend logs for errors
- Ensure Supabase credentials are correct

---

## 📊 Monitor Your App

In Railway Dashboard:
- Click service → "Logs" to see output
- Click "Metrics" to see CPU/Memory/Requests
- Set up alerts in "Settings"

---

## 💡 Pro Tips

1. **Auto-redeploy**: Every push to main auto-deploys
2. **Disable auto-deploy**: Service Settings → toggle off
3. **View logs**: Click "Logs" tab for real-time output
4. **Share URLs**: Your Railway URLs are your live demo links

---

## 🎥 You're Ready for the Hackathon!

Your app is now:
- ✅ Live on the internet
- ✅ Accessible 24/7
- ✅ Scalable with Railway
- ✅ Professional deployment

**Share these links in your hackathon submission:**
- Frontend: `https://your-frontend-xxx.railway.app`
- Backend API: `https://your-backend-xxx.railway.app`
- GitHub: `https://github.com/YourOrg/MSiT-AI-Assistant`
