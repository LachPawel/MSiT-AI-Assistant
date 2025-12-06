import { classifyCase } from '../services/openai.service';

export interface ClassificationResult {
  category: 'funding' | 'permits' | 'licenses' | 'other';
  keywords: string[];
  extractedDetails: {
    amount?: number;
    location?: string;
    facilityType?: string;
    urgency?: string;
  };
  confidence: number;
}

export async function classifyCaseAgent(
  description: string
): Promise<ClassificationResult> {
  const result = await classifyCase(description);

  // Add confidence scoring logic
  const confidence = calculateConfidence(result);

  return {
    ...result,
    confidence,
  };
}

function calculateConfidence(result: any): number {
  // Simple confidence calculation
  let score = 0.5;

  if (result.category) score += 0.2;
  if (result.keywords && result.keywords.length > 0) score += 0.15;
  if (result.extractedDetails && Object.keys(result.extractedDetails).length > 0)
    score += 0.15;

  return Math.min(score, 1.0);
}

