-- Migration script to update existing MSiT AI Assistant database
-- Run this in your Supabase SQL Editor

-- First, let's add the missing columns to ai_analyses table
DO $$ 
BEGIN 
    -- Add risk_score column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_analyses' AND column_name = 'risk_score') THEN
        ALTER TABLE ai_analyses ADD COLUMN risk_score FLOAT;
    END IF;
    
    -- Add draft_decision column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_analyses' AND column_name = 'draft_decision') THEN
        ALTER TABLE ai_analyses ADD COLUMN draft_decision TEXT;
    END IF;
    
    -- Add legal_basis_analysis column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_analyses' AND column_name = 'legal_basis_analysis') THEN
        ALTER TABLE ai_analyses ADD COLUMN legal_basis_analysis TEXT;
    END IF;
    
    -- Add recommended_action column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_analyses' AND column_name = 'recommended_action') THEN
        ALTER TABLE ai_analyses ADD COLUMN recommended_action TEXT;
    END IF;
END $$;

-- Update cases table to include new status values
ALTER TABLE cases DROP CONSTRAINT IF EXISTS cases_status_check;
ALTER TABLE cases ADD CONSTRAINT cases_status_check 
    CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'closed'));

-- Add updated_at and priority columns to cases if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cases' AND column_name = 'updated_at') THEN
        ALTER TABLE cases ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cases' AND column_name = 'priority') THEN
        ALTER TABLE cases ADD COLUMN priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
    END IF;
END $$;

-- Create new tables if they don't exist
CREATE TABLE IF NOT EXISTS case_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_type TEXT,
  file_url TEXT,
  summary TEXT,
  extracted_text TEXT,
  analysis_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS case_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
  is_statutory BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create funding opportunities table
CREATE TABLE IF NOT EXISTS funding_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  program_code TEXT,
  description TEXT,
  funding_amount_min DECIMAL,
  funding_amount_max DECIMAL,
  application_deadline DATE,
  eligibility_requirements TEXT[],
  match_relevance FLOAT, -- How relevant this opportunity is to the case (0-1)
  source_url TEXT,
  program_status TEXT DEFAULT 'active' CHECK (program_status IN ('active', 'closed', 'upcoming')),
  discovered_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_case_documents_case_id ON case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_case_deadlines_case_id ON case_deadlines(case_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_funding_opportunities_case_id ON funding_opportunities(case_id);
CREATE INDEX IF NOT EXISTS idx_funding_opportunities_deadline ON funding_opportunities(application_deadline);

-- Delete old procedure data and insert new tourism procedures
DELETE FROM procedures WHERE name = 'Dofinansowanie budowy obiektów sportowych';

-- Insert tourism procedures only if they don't already exist
DO $$
BEGIN
    -- Insert hotel categorization procedure
    IF NOT EXISTS (SELECT 1 FROM procedures WHERE name = 'Nadanie kategorii hotelom') THEN
        INSERT INTO procedures (name, category, description, required_documents, eligibility_criteria, steps, avg_processing_days, legal_basis) VALUES
        ('Nadanie kategorii hotelom', 'permits', 'Procedura nadawania kategorii obiektom hotelarskim zgodnie z Rozporządzeniem w sprawie obiektów hotelarskich.', 
         ARRAY['Wniosek o nadanie kategorii', 'Plan sytuacyjny obiektu', 'Dokumentacja techniczna pomieszczeń', 'Spis wyposażenia', 'Regulamin hotelu', 'Cennik usług'],
         '{"min_rooms": 10, "building_standards": ["accessibility", "fire_safety"], "service_requirements": ["reception_24h", "room_service"]}'::jsonb,
         '[{"step": 1, "action": "Złożenie wniosku z dokumentacją", "days": 0}, {"step": 2, "action": "Weryfikacja formalna", "days": 7}, {"step": 3, "action": "Kontrola obiektu", "days": 14}, {"step": 4, "action": "Decyzja o nadaniu kategorii", "days": 14}]'::jsonb,
         35,
         'Rozporządzenie Ministra Gospodarki i Pracy z dnia 19 sierpnia 2004 r. w sprawie obiektów hotelarskich i innych obiektów.');
    END IF;

    -- Insert tour guide license procedure  
    IF NOT EXISTS (SELECT 1 FROM procedures WHERE name = 'Licencja pilota wycieczek') THEN
        INSERT INTO procedures (name, category, description, required_documents, eligibility_criteria, steps, avg_processing_days, legal_basis) VALUES
        ('Licencja pilota wycieczek', 'licenses', 'Procedura wydawania licencji na wykonywanie zawodu pilota wycieczek zgodnie z Ustawą o usługach turystycznych.',
         ARRAY['Wniosek o wydanie licencji', 'Dyplom ukończenia studiów', 'Zaświadczenie o stanie zdrowia', 'Zaświadczenie o niekaralności', 'Certyfikat znajomości języków obcych'],
         '{"education": ["tourism", "geography", "history"], "languages": ["english_b2"], "health_certificate": true}'::jsonb,
         '[{"step": 1, "action": "Złożenie wniosku", "days": 0}, {"step": 2, "action": "Weryfikacja dokumentów", "days": 14}, {"step": 3, "action": "Egzamin praktyczny", "days": 21}, {"step": 4, "action": "Wydanie licencji", "days": 7}]'::jsonb,
         42,
         'Ustawa z dnia 29 sierpnia 1997 r. o usługach turystycznych (Dz.U. 1997 nr 133 poz. 884).');
    END IF;
END $$;