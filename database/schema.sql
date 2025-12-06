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

-- Seed data: Sample Polish procedure
INSERT INTO procedures (name, category, description, required_documents, eligibility_criteria, steps, avg_processing_days) VALUES
('Dofinansowanie budowy obiektów sportowych', 'funding', 'Program dofinansowania budowy i modernizacji obiektów sportowych', 
 ARRAY['Wniosek o dofinansowanie', 'Zaświadczenie o niezaleganiu z podatków', 'Plan finansowy projektu', 'Dokumentacja techniczna', 'Pozwolenie na budowę'],
 '{"min_budget": 100000, "max_budget": 5000000, "entity_type": ["club", "municipality", "foundation"]}'::jsonb,
 '[{"step": 1, "action": "Złożenie wniosku z kompletem dokumentów", "days": 0}, {"step": 2, "action": "Weryfikacja formalna", "days": 14}, {"step": 3, "action": "Ocena merytoryczna", "days": 21}, {"step": 4, "action": "Decyzja komisji", "days": 30}]'::jsonb,
 30);

-- Create indexes for better performance
CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_category ON cases(category);
CREATE INDEX idx_ai_analyses_case_id ON ai_analyses(case_id);
CREATE INDEX idx_chat_messages_case_id ON chat_messages(case_id);

