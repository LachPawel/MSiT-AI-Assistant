# MSiT AI Assistant

Full-stack AI administrative assistant for Poland's Ministry of Sport & Tourism (MSiT). The system helps officers process administrative cases (funding, permits, licenses) using AI agents.

## Project Structure

```
msit-assistant/
├── frontend/                 # Vue 3 + TypeScript
├── backend/                  # Node.js + Express + TypeScript  
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- OpenAI API key
- Exa API key (optional, for research features)

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
EXA_API_KEY=your_exa_key
NODE_ENV=development
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3001
```

### 3. Database Setup

Create a new Supabase project and run the following SQL in the SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Procedures table
CREATE TABLE procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('funding', 'permits', 'licenses')),
  description TEXT,
  required_documents TEXT[] DEFAULT '{}',
  eligibility_criteria JSONB DEFAULT '{}',
  steps JSONB DEFAULT '[]',
  avg_processing_days INTEGER,
  legal_basis TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cases table
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  applicant_details JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
  assigned_procedure_id UUID REFERENCES procedures(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI analyses table
CREATE TABLE ai_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  matched_procedure_id UUID REFERENCES procedures(id),
  confidence_score FLOAT,
  reasoning TEXT,
  missing_documents TEXT[] DEFAULT '{}',
  risk_flags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data: Sample Polish procedure
INSERT INTO procedures (name, category, description, required_documents, eligibility_criteria, steps, avg_processing_days) VALUES
('Dofinansowanie budowy obiektów sportowych', 'funding', 'Program dofinansowania budowy i modernizacji obiektów sportowych', 
 ARRAY['Wniosek o dofinansowanie', 'Zaświadczenie o niezaleganiu z podatków', 'Plan finansowy projektu', 'Dokumentacja techniczna', 'Pozwolenie na budowę'],
 '{"min_budget": 100000, "max_budget": 5000000, "entity_type": ["club", "municipality", "foundation"]}'::jsonb,
 '[{"step": 1, "action": "Złożenie wniosku z kompletem dokumentów", "days": 0}, {"step": 2, "action": "Weryfikacja formalna", "days": 14}, {"step": 3, "action": "Ocena merytoryczna", "days": 21}, {"step": 4, "action": "Decyzja komisji", "days": 30}]'::jsonb,
 30);
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The backend will run on `http://localhost:3001` and the frontend on `http://localhost:5173` (or similar Vite port).

### 5. Research Procedures (Optional)

To populate the database with procedures researched from the web:

```bash
curl -X POST http://localhost:3001/api/research/procedures
```

## Features

- **AI-Powered Case Classification**: Automatically classifies administrative cases into categories (funding, permits, licenses)
- **Procedure Matching**: Matches cases to appropriate administrative procedures
- **Interactive Chat**: Chat with AI assistant about specific cases
- **Document Requirements**: Lists required documents for each procedure
- **Step-by-Step Guidance**: Provides detailed guidance for processing cases
- **Research Integration**: Uses Exa AI to research and extract procedures from web sources

## API Endpoints

### Cases
- `GET /api/cases` - Get all cases
- `GET /api/cases/:id` - Get single case
- `POST /api/cases` - Create new case

### AI
- `POST /api/ai/analyze/:caseId` - Analyze case with AI
- `POST /api/ai/chat/:caseId` - Chat with AI about case

### Procedures
- `GET /api/procedures` - Get all procedures
- `POST /api/procedures` - Create procedure (admin)

### Research
- `POST /api/research/procedures` - Research and populate procedures

## Technology Stack

### Backend
- Node.js + Express
- TypeScript
- Supabase (PostgreSQL)
- OpenAI GPT-4
- Exa AI (for research)

### Frontend
- Vue 3 (Composition API)
- TypeScript
- Pinia (state management)
- Vue Router
- Tailwind CSS
- Axios

## Polish Context

- All UI text is in Polish
- Procedures reference real MSiT programs
- Amounts in PLN (złoty)
- References actual Polish administrative law concepts

## Production Deployment

1. Build backend: `cd backend && npm run build`
2. Build frontend: `cd frontend && npm run build`
3. Set production environment variables
4. Deploy backend to your hosting service
5. Deploy frontend to a static hosting service (Vercel, Netlify, etc.)

## License

ISC

