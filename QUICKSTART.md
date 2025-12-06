# Quick Start Guide

## 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## 2. Set Up Environment Variables

### Backend (.env)
```bash
cd backend
cp .env.example .env
# Edit .env with your actual keys
```

Required:
- `SUPABASE_URL` - From your Supabase project settings
- `SUPABASE_ANON_KEY` - From your Supabase project settings
- `OPENAI_API_KEY` - From OpenAI platform
- `EXA_API_KEY` - From exa.ai (optional for research)

### Frontend (.env)
```bash
cd frontend
cp .env.example .env
# Usually no changes needed if backend runs on localhost:3001
```

## 3. Set Up Database

1. Go to your Supabase project
2. Open SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL script

This creates:
- `procedures` table
- `cases` table
- `ai_analyses` table
- `chat_messages` table
- Sample procedure data

## 4. Start Development Servers

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

## 5. Access the Application

- Frontend: http://localhost:5173 (or the port Vite assigns)
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health

## 6. Test the Application

1. Go to the frontend URL
2. Fill out the case form with a sample case:
   - Title: "Klub sportowy prosi o dofinansowanie hali"
   - Description: "Klub piłkarski z Warszawy potrzebuje dofinansowania na budowę nowej hali sportowej o powierzchni 2000m². Budżet projektu: 2 000 000 PLN."
   - Applicant: "KS Warszawa", NIP: "1234567890"
3. Click "Utwórz i Analizuj"
4. The AI will analyze the case and match it to a procedure
5. Use the chat interface to ask questions about the case

## Troubleshooting

### Backend won't start
- Check that all environment variables are set in `backend/.env`
- Ensure port 3001 is not in use
- Verify Node.js version is 18+

### Frontend won't start
- Check that `VITE_API_URL` in `frontend/.env` matches your backend URL
- Ensure port 5173 (or assigned port) is not in use

### Database errors
- Verify Supabase connection strings are correct
- Check that all tables were created successfully
- Ensure RLS (Row Level Security) policies allow access if enabled

### AI analysis fails
- Verify OpenAI API key is valid and has credits
- Check that at least one procedure exists in the database
- Review backend logs for detailed error messages

## Next Steps

- Research more procedures: `POST /api/research/procedures`
- Add authentication (currently using demo-user)
- Customize AI prompts in `backend/src/services/openai.service.ts`
- Add more procedure categories and types

