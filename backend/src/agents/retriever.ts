import { supabase, Procedure } from '../config/supabase';
import { ClassificationResult } from './classifier';

export async function retrieveProcedures(
  classification: ClassificationResult
): Promise<Procedure[]> {
  // Basic keyword matching
  let query = supabase
    .from('procedures')
    .select('*')
    .eq('category', classification.category);

  const { data, error } = await query.limit(3);

  if (error) {
    console.error('Retrieval error:', error);
    throw error;
  }

  return data || [];
}

export async function findBestMatch(
  procedures: Procedure[],
  caseDetails: any
): Promise<{ procedure: Procedure; score: number } | null> {
  if (procedures.length === 0) return null;

  // Simple scoring - in production, use embeddings/semantic search
  const scored = procedures.map(proc => ({
    procedure: proc,
    score: calculateMatchScore(proc, caseDetails),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored[0];
}

function calculateMatchScore(procedure: Procedure, caseDetails: any): number {
  let score = 0.5;

  // Check eligibility criteria
  if (procedure.eligibility_criteria && caseDetails.extractedDetails) {
    const criteria = procedure.eligibility_criteria;
    const details = caseDetails.extractedDetails;

    if (criteria.min_budget && details.amount) {
      if (details.amount >= criteria.min_budget) score += 0.2;
    }
  }

  return Math.min(score, 1.0);
}

