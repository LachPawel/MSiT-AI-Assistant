import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables before creating client
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing required environment variables: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Procedure {
  id: string;
  name: string;
  category: 'funding' | 'permits' | 'licenses';
  description: string;
  required_documents: string[];
  eligibility_criteria: Record<string, any>;
  steps: Array<{ step: number; action: string; days?: number }>;
  avg_processing_days: number;
  legal_basis?: string;
  created_at: string;
}

export interface Case {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category?: string;
  applicant_details: Record<string, any>;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  assigned_procedure_id?: string;
  created_at: string;
}

export interface AIAnalysis {
  id: string;
  case_id: string;
  matched_procedure_id: string;
  confidence_score: number;
  reasoning: string;
  missing_documents: string[];
  risk_flags: string[];
  created_at: string;
}

