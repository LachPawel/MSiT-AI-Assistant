-- MSiT AI Assistant Database Schema
-- Run this in your Supabase SQL Editor

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

-- Seed data: Sample tourism procedures for MSiT Department
INSERT INTO procedures (name, category, description, required_documents, eligibility_criteria, steps, avg_processing_days, legal_basis) VALUES
('Nadanie kategorii hotelom', 'permits', 'Procedura nadawania kategorii obiektom hotelarskim zgodnie z Rozporządzeniem w sprawie obiektów hotelarskich.', 
 ARRAY['Wniosek o nadanie kategorii', 'Plan sytuacyjny obiektu', 'Dokumentacja techniczna pomieszczeń', 'Spis wyposażenia', 'Regulamin hotelu', 'Cennik usług'],
 '{"min_rooms": 10, "building_standards": ["accessibility", "fire_safety"], "service_requirements": ["reception_24h", "room_service"]}'::jsonb,
 '[{"step": 1, "action": "Złożenie wniosku z dokumentacją", "days": 0}, {"step": 2, "action": "Weryfikacja formalna", "days": 7}, {"step": 3, "action": "Kontrola obiektu", "days": 14}, {"step": 4, "action": "Decyzja o nadaniu kategorii", "days": 14}]'::jsonb,
 35,
 'Rozporządzenie Ministra Gospodarki i Pracy z dnia 19 sierpnia 2004 r. w sprawie obiektów hotelarskich i innych obiektów.'),

('Licencja pilota wycieczek', 'licenses', 'Procedura wydawania licencji na wykonywanie zawodu pilota wycieczek zgodnie z Ustawą o usługach turystycznych.',
 ARRAY['Wniosek o wydanie licencji', 'Dyplom ukończenia studiów', 'Zaświadczenie o stanie zdrowia', 'Zaświadczenie o niekaralności', 'Certyfikat znajomości języków obcych'],
 '{"education": ["tourism", "geography", "history"], "languages": ["english_b2"], "health_certificate": true}'::jsonb,
 '[{"step": 1, "action": "Złożenie wniosku", "days": 0}, {"step": 2, "action": "Weryfikacja dokumentów", "days": 14}, {"step": 3, "action": "Egzamin praktyczny", "days": 21}, {"step": 4, "action": "Wydanie licencji", "days": 7}]'::jsonb,
 42,
 'Ustawa z dnia 29 sierpnia 1997 r. o usługach turystycznych (Dz.U. 1997 nr 133 poz. 884).');

-- Create indexes for better performance
CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_category ON cases(category);
CREATE INDEX idx_ai_analyses_case_id ON ai_analyses(case_id);
CREATE INDEX idx_chat_messages_case_id ON chat_messages(case_id);

