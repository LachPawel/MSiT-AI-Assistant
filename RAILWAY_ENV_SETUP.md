# Railway Environment Variables Template

## Backend Environment Variables

Copy and fill in these values in Railway Dashboard → Backend Service → Variables:

```
# Node Environment
NODE_ENV=production
PORT=3001

# Supabase Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (get from Supabase dashboard)
SUPABASE_SERVICE_KEY=eyJhbGc... (get from Supabase settings)

# OpenAI
OPENAI_API_KEY=sk-... (get from https://platform.openai.com/api-keys)

# Exa.ai (Optional - for research/web search)
EXA_API_KEY=your_exa_key (optional, get from https://exa.ai)

# Logging
LOG_LEVEL=info
```

### How to Get These Values:

**SUPABASE_URL & SUPABASE_ANON_KEY:**
1. Go to https://app.supabase.com
2. Select your project
3. Settings → API
4. Copy "Project URL" and "anon public" key

**SUPABASE_SERVICE_KEY:**
1. Same location as above
2. Copy "service_role" key (keep this secret!)

**OPENAI_API_KEY:**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key (you won't see it again!)

---

## Frontend Environment Variables

Copy and fill in Railway Dashboard → Frontend Service → Variables:

```
VITE_API_URL=https://your-backend-xxx.railway.app
NODE_ENV=production
```

### How to Get These Values:

**VITE_API_URL:**
1. Deploy backend first
2. Go to Railway → Backend Service
3. Copy the Railway URL
4. Paste it here

---

## Step-by-Step Railway Configuration

### 1. Deploy Backend
1. Railway Dashboard → "New Project" → "Deploy from GitHub"
2. Select repo, set root to `/backend`
3. Railway will auto-detect Node.js
4. Go to "Variables" tab
5. Add all variables from "Backend Environment Variables" above
6. Click "Deploy"
7. **Wait for ✅ Deployed** status

### 2. Get Backend URL
1. Click Backend service
2. Copy the URL from top of page
3. It looks like: `https://msit-backend-prod-xxxxx.railway.app`

### 3. Deploy Frontend
1. Railway Dashboard → "New Project" → "Deploy from GitHub"
2. Select repo, set root to `/frontend`
3. Railway will auto-detect Node.js / Vite
4. Go to "Variables" tab
5. Add `VITE_API_URL=https://your-backend-url-here`
6. Click "Deploy"
7. **Wait for ✅ Deployed** status

### 4. Test Everything
1. Visit your frontend URL
2. Create a test case
3. Run "Analizuj z AI"
4. Check if AI analysis appears
5. Visit `/officer` dashboard

---

## Troubleshooting Variables

### Variables not being used?
1. Make sure variable names are **exact** (case-sensitive)
2. Redeploy after changing variables
3. Check Railway logs to verify variables are loaded

### Backend says "Database connection failed"?
- Check `SUPABASE_URL` is correct
- Check `SUPABASE_ANON_KEY` is valid
- Run migration.sql in Supabase first

### Frontend shows "Cannot connect to API"?
- Check `VITE_API_URL` is correct
- Make sure backend is deployed and running
- Check browser DevTools → Network tab for failed requests

---

## Security Notes

⚠️ **NEVER commit these to GitHub:**
- `.env.production` (it's in .gitignore, but double-check)
- API keys in code
- Database credentials

✅ **DO store these in Railway:**
- All sensitive values go in Variables tab
- Railway encrypts them
- Never shown in logs

---

## Environment Variable Reference

| Variable | Example | Where to Get |
|----------|---------|--------------|
| SUPABASE_URL | https://abc.supabase.co | Supabase Dashboard → Settings → API |
| SUPABASE_ANON_KEY | eyJhbGc... | Same location |
| SUPABASE_SERVICE_KEY | eyJhbGc... | Same location |
| OPENAI_API_KEY | sk-... | platform.openai.com/api-keys |
| EXA_API_KEY | optional | exa.ai |
| VITE_API_URL | https://your-backend.railway.app | From deployed backend |

---

## Next Steps

1. ✅ Gather all environment variables
2. ✅ Deploy backend first
3. ✅ Copy backend URL
4. ✅ Update frontend VITE_API_URL
5. ✅ Deploy frontend
6. ✅ Test end-to-end
7. 🎉 Share your live demo!
