# Deployment Guide: Railway.app

This guide covers deploying the MSiT AI Assistant backend and frontend to Railway.

## Prerequisites

1. **Railway Account**: Sign up at https://railway.app
2. **GitHub Account**: Repository should be public or connected to Railway
3. **Environment Variables**: Prepared for both backend and frontend

---

## 🚀 Backend Deployment (Node.js + Express)

### Step 1: Prepare Backend for Deployment

1. **Add `Procfile`** in `/backend` root:
```
web: npm run start
```

2. **Add `railway.json`** in `/backend` root:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "npm run start",
    "restartPolicyMaxRetries": 10
  }
}
```

3. **Update `package.json`** - ensure you have a start script:
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### Step 2: Create Backend Deployment on Railway

1. Go to https://railway.app/dashboard
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repository
4. Choose `/backend` as the root directory
5. Click **"Deploy"**

### Step 3: Configure Environment Variables

In Railway Dashboard:
1. Go to your Backend service → **"Variables"**
2. Add the following environment variables:

```
NODE_ENV=production

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Exa.ai (Optional - for research)
EXA_API_KEY=your_exa_api_key

# Backend Port
PORT=3001
```

### Step 4: Set Production Build Command

1. Go to **"Build"** tab
2. Set **Build Command**:
```bash
npm install && npm run build
```

3. Set **Start Command**:
```bash
npm run start
```

4. Click **"Deploy"**

### Step 5: Get Backend URL

After deployment completes:
1. Click on your Backend service
2. Copy the **Railway URL** (format: `https://your-backend-xxx.railway.app`)
3. Save this for frontend configuration

---

## 🎨 Frontend Deployment (Vue 3 + Vite)

### Step 1: Prepare Frontend for Deployment

1. **Create `.env.production`** in `/frontend`:
```
VITE_API_URL=https://your-backend-xxx.railway.app
```

2. **Update `vite.config.ts`** to ensure proper build:
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

3. **Create `package.json` build script** (ensure it exists):
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  }
}
```

### Step 2: Create Frontend Deployment on Railway

1. Go to https://railway.app/dashboard
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repository
4. Choose `/frontend` as the root directory

### Step 3: Configure Frontend Build

1. Go to **"Build"** tab
2. Set **Build Command**:
```bash
npm install && npm run build
```

3. Set **Start Command** (Railway will use Nixpacks):
Leave empty (Railway auto-detects Vite static build)

4. Click **"Deploy"**

### Step 4: Configure Frontend Environment Variables

1. Go to Frontend service → **"Variables"**
2. Add:
```
VITE_API_URL=https://your-backend-xxx.railway.app
NODE_ENV=production
```

### Step 5: Get Frontend URL

After deployment:
1. Copy the **Railway URL** for your frontend
2. This is your public application URL

---

## 🗄️ Database Setup (Supabase)

Your Supabase database doesn't need Railway - it's already hosted. Just ensure:

1. **Database migrations are applied**: Run `migration.sql` in your Supabase SQL Editor
2. **Environment variables are set**: Use your Supabase credentials in both deployments

---

## 🔗 Connect Frontend to Backend

### In Railway Dashboard:

1. **Frontend Service Settings**
2. Go to **"Variables"**
3. Update `VITE_API_URL` to your deployed backend URL
4. Trigger redeploy

### In `frontend/src/config/api.ts`:
```typescript
const API_BASE = process.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});
```

---

## ✅ Deployment Checklist

### Backend
- [ ] Add `Procfile` and `railway.json`
- [ ] Update `package.json` with start script
- [ ] Set all environment variables
- [ ] Deploy from GitHub
- [ ] Test health endpoint: `GET /api/health`
- [ ] Copy backend URL

### Frontend
- [ ] Create `.env.production` with backend URL
- [ ] Update `vite.config.ts`
- [ ] Set build command
- [ ] Deploy from GitHub
- [ ] Update `VITE_API_URL` variable
- [ ] Test application access

### Database
- [ ] Run `migration.sql` in Supabase
- [ ] Verify tables exist
- [ ] Test API connectivity

---

## 🧪 Testing Deployment

### Test Backend:
```bash
curl https://your-backend-xxx.railway.app/api/health
```

### Test Frontend:
1. Visit: `https://your-frontend-xxx.railway.app`
2. Create a test case
3. Run AI analysis
4. Check Officer Dashboard

---

## 🚨 Common Issues & Solutions

### Backend won't start
- Check **Build Logs** in Railway Dashboard
- Ensure `npm run build` works locally: `cd backend && npm run build`
- Verify all dependencies in `package.json`

### Frontend shows blank page
- Check browser console for API errors
- Ensure `VITE_API_URL` matches backend URL
- Clear browser cache and redeploy

### API requests fail from frontend
- Check CORS configuration in backend `server.ts`
- Verify backend environment variables
- Check Railway logs for server errors

### Database connection issues
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Run migration.sql in Supabase first
- Check Supabase dashboard for any issues

---

## 📊 Monitoring

In Railway Dashboard:
1. Click your service
2. Go to **"Logs"** to see real-time output
3. Go to **"Metrics"** to monitor CPU, memory, requests
4. Set up alerts under **"Settings"**

---

## 🔄 Continuous Deployment

Railway automatically redeploys when you:
1. Push changes to `main` branch
2. Or manually click **"Deploy"** button

To disable auto-deploy:
1. Service → **Settings** → Toggle off **"Auto-deploy on push"**

---

## 💰 Pricing

Railway offers:
- **Free tier**: $5 credit/month (sufficient for testing)
- **Pay-as-you-go**: Usage-based after credits

---

## 📚 Additional Resources

- Railway Docs: https://docs.railway.app
- Railway CLI: https://docs.railway.app/cli/quick-start
- Vue 3 Deployment: https://vitejs.dev/guide/build.html
- Node.js on Railway: https://docs.railway.app/guides/nixpacks

---

## Next Steps

1. **Deploy Backend First** (takes ~2-3 minutes)
2. **Update Frontend .env with Backend URL**
3. **Deploy Frontend** (takes ~2-3 minutes)
4. **Test End-to-End**
5. **Share URLs for demo/testing**
