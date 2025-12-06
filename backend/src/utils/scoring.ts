import { openai } from '../services/openai.service';
import logger from './logger';

export interface CaseDetails {
  title: string;
  description: string;
  category?: string;
  applicant_details?: any;
}

export interface FundingOpportunity {
  name: string;
  description: string;
  amount_range?: string;
  eligibility_criteria?: string;
  category?: string;
  deadline?: string;
}

export interface ScoringResult {
  score: number;
  justification: string;
  isExpired: boolean;
}

/**
 * Calculate relevance score and generate justification
 * Returns score, justification, and expiration status
 */
export async function calculateRelevanceScore(
  caseDetails: CaseDetails,
  opportunity: FundingOpportunity
): Promise<ScoringResult> {
  let score = 0;
  const weights = {
    semantic: 0.4, // Semantic similarity (most important)
    keywords: 0.25, // Keyword matching
    category: 0.2, // Category match
    budget: 0.15, // Budget compatibility
  };

  let semanticScore = 0;
  let keywordScore = 0;
  let categoryScore = 0;
  let budgetScore = 0;

  // 1. Semantic similarity using OpenAI
  try {
    semanticScore = await calculateSemanticSimilarity(
      caseDetails,
      opportunity
    );
    score += semanticScore * weights.semantic;
    logger.debug('Semantic score', { semanticScore, opportunity: opportunity.name });
  } catch (error) {
    logger.warn('Error calculating semantic similarity', { error });
    semanticScore = 0.5; // Default neutral score on error
  }

  // 2. Keyword matching
  keywordScore = calculateKeywordMatch(caseDetails, opportunity);
  score += keywordScore * weights.keywords;
  logger.debug('Keyword score', { keywordScore, opportunity: opportunity.name });

  // 3. Category matching
  categoryScore = calculateCategoryMatch(caseDetails, opportunity);
  score += categoryScore * weights.category;
  logger.debug('Category score', { categoryScore, opportunity: opportunity.name });

  // 4. Budget compatibility
  budgetScore = calculateBudgetCompatibility(caseDetails, opportunity);
  score += budgetScore * weights.budget;
  logger.debug('Budget score', { budgetScore, opportunity: opportunity.name });

  // Normalize to 0-1 range
  const finalScore = Math.min(Math.max(score, 0), 1);

  // Check if deadline has passed
  const isExpired = checkIfExpired(opportunity.deadline);

  // Generate justification
  const justification = await generateJustification(
    caseDetails,
    opportunity,
    finalScore,
    {
      semanticScore,
      keywordScore,
      categoryScore,
      budgetScore,
    }
  );

  return {
    score: finalScore,
    justification,
    isExpired,
  };
}

/**
 * Check if funding opportunity deadline has passed
 */
function checkIfExpired(deadline?: string): boolean {
  if (!deadline) return false;

  try {
    // Try to parse various date formats
    let deadlineDate: Date | null = null;

    // Format: "2024-12-31" or "31.12.2024" or "31 grudnia 2024"
    const datePatterns = [
      /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
      /(\d{1,2})\.(\d{1,2})\.(\d{4})/, // DD.MM.YYYY
      /(\d{1,2})\s+(stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|października|listopada|grudnia)\s+(\d{4})/i, // Polish format
    ];

    const months = {
      stycznia: 0, lutego: 1, marca: 2, kwietnia: 3, maja: 4, czerwca: 5,
      lipca: 6, sierpnia: 7, września: 8, października: 9, listopada: 10, grudnia: 11,
    };

    for (const pattern of datePatterns) {
      const match = deadline.match(pattern);
      if (match) {
        if (pattern === datePatterns[0]) {
          // YYYY-MM-DD
          deadlineDate = new Date(
            parseInt(match[1]),
            parseInt(match[2]) - 1,
            parseInt(match[3])
          );
        } else if (pattern === datePatterns[1]) {
          // DD.MM.YYYY
          deadlineDate = new Date(
            parseInt(match[3]),
            parseInt(match[2]) - 1,
            parseInt(match[1])
          );
        } else if (pattern === datePatterns[2]) {
          // Polish format
          const monthName = match[2].toLowerCase();
          deadlineDate = new Date(
            parseInt(match[3]),
            months[monthName as keyof typeof months],
            parseInt(match[1])
          );
        }
        break;
      }
    }

    // If no pattern matched, try direct Date parsing
    if (!deadlineDate) {
      deadlineDate = new Date(deadline);
    }

    // Check if date is valid
    if (isNaN(deadlineDate.getTime())) {
      logger.warn('Invalid deadline format', { deadline });
      return false;
    }

    // Compare with today (end of day)
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return deadlineDate < today;
  } catch (error) {
    logger.warn('Error checking deadline', { error, deadline });
    return false;
  }
}

/**
 * Generate human-readable justification for the match
 */
async function generateJustification(
  caseDetails: CaseDetails,
  opportunity: FundingOpportunity,
  finalScore: number,
  componentScores: {
    semanticScore: number;
    keywordScore: number;
    categoryScore: number;
    budgetScore: number;
  }
): Promise<string> {
  try {
    const reasons: string[] = [];

    // Add reasons based on component scores
    if (componentScores.semanticScore > 0.7) {
      reasons.push('wysokie dopasowanie semantyczne do opisu wniosku');
    } else if (componentScores.semanticScore > 0.5) {
      reasons.push('częściowe dopasowanie do opisu wniosku');
    }

    if (componentScores.keywordScore > 0.6) {
      reasons.push('zgodność kluczowych słów i terminów');
    }

    if (componentScores.categoryScore > 0.7) {
      reasons.push(`dopasowanie do kategorii: ${caseDetails.category || 'dofinansowanie'}`);
    }

    if (componentScores.budgetScore > 0.8) {
      reasons.push('budżet projektu mieści się w zakresie programu');
    } else if (componentScores.budgetScore > 0.5) {
      reasons.push('budżet projektu częściowo zgodny z programem');
    }

    // Use OpenAI to generate a more natural justification
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'Jesteś ekspertem w dopasowywaniu wniosków do programów dofinansowania. Napisz krótkie, profesjonalne uzasadnienie (2-3 zdania) dlaczego ten program jest odpowiedni dla wniosku.',
        },
        {
          role: 'user',
          content: `Wniosek: "${caseDetails.title}"\nOpis: "${caseDetails.description.substring(0, 500)}"\n\nProgram: "${opportunity.name}"\nOpis programu: "${opportunity.description.substring(0, 500)}"\n\nPowody dopasowania: ${reasons.join(', ')}\nScore: ${(finalScore * 100).toFixed(0)}%\n\nNapisz uzasadnienie po polsku:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0].message.content || generateFallbackJustification(reasons, finalScore);
  } catch (error) {
    logger.warn('Error generating justification', { error });
    return generateFallbackJustification(
      [
        componentScores.semanticScore > 0.5 ? 'dopasowanie semantyczne' : '',
        componentScores.keywordScore > 0.5 ? 'zgodność słów kluczowych' : '',
        componentScores.categoryScore > 0.5 ? 'dopasowanie kategorii' : '',
        componentScores.budgetScore > 0.5 ? 'zgodność budżetu' : '',
      ].filter(Boolean),
      finalScore
    );
  }
}

/**
 * Generate fallback justification if AI fails
 */
function generateFallbackJustification(reasons: string[], score: number): string {
  if (reasons.length === 0) {
    return `Program częściowo dopasowany (${(score * 100).toFixed(0)}% dopasowania).`;
  }

  const scoreText =
    score > 0.8
      ? 'wysokie'
      : score > 0.6
      ? 'dobre'
      : score > 0.4
      ? 'umiarkowane'
      : 'niskie';

  return `Program wykazuje ${scoreText} dopasowanie (${(score * 100).toFixed(0)}%) ze względu na: ${reasons.join(', ')}.`;
}

/**
 * Calculate semantic similarity using OpenAI embeddings
 */
async function calculateSemanticSimilarity(
  caseDetails: CaseDetails,
  opportunity: FundingOpportunity
): Promise<number> {
  try {
    const caseText = `${caseDetails.title} ${caseDetails.description}`.toLowerCase();
    const opportunityText = `${opportunity.name} ${opportunity.description} ${opportunity.eligibility_criteria || ''}`.toLowerCase();

    // Use OpenAI to compare similarity
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'Jesteś ekspertem w dopasowywaniu wniosków do programów dofinansowania. Oceniasz dopasowanie w skali 0-1, gdzie 1 oznacza idealne dopasowanie.',
        },
        {
          role: 'user',
          content: `Wniosek: "${caseText}"\n\nProgram dofinansowania: "${opportunityText}"\n\nOceń dopasowanie w skali 0-1 (tylko liczba, bez dodatkowych komentarzy):`,
        },
      ],
      temperature: 0.3,
      max_tokens: 10,
    });

    const similarity = parseFloat(
      response.choices[0].message.content?.trim() || '0.5'
    );
    return isNaN(similarity) ? 0.5 : Math.max(0, Math.min(1, similarity));
  } catch (error) {
    logger.warn('Error in semantic similarity calculation', { error });
    return 0.5; // Default neutral score
  }
}

/**
 * Calculate keyword matching score
 */
function calculateKeywordMatch(
  caseDetails: CaseDetails,
  opportunity: FundingOpportunity
): number {
  const caseText = `${caseDetails.title} ${caseDetails.description}`.toLowerCase();
  const oppText = `${opportunity.name} ${opportunity.description} ${opportunity.eligibility_criteria || ''}`.toLowerCase();

  // Extract important keywords from case
  const caseKeywords = extractKeywords(caseText);
  const oppKeywords = extractKeywords(oppText);

  // Count matches
  let matches = 0;
  for (const keyword of caseKeywords) {
    if (oppText.includes(keyword)) {
      matches++;
    }
  }

  // Score based on percentage of matched keywords
  return caseKeywords.length > 0 ? matches / caseKeywords.length : 0.5;
}

/**
 * Extract important keywords from text
 */
function extractKeywords(text: string): string[] {
  // Common stop words in Polish
  const stopWords = new Set([
    'i', 'oraz', 'lub', 'ale', 'że', 'na', 'w', 'z', 'do', 'od', 'po', 'przed',
    'pod', 'nad', 'dla', 'przez', 'o', 'a', 'się', 'jest', 'są', 'być', 'to',
    'ten', 'ta', 'te', 'jego', 'jej', 'ich', 'nasz', 'wasz', 'swój', 'który',
    'która', 'które', 'co', 'jak', 'gdzie', 'kiedy', 'dlaczego', 'czy',
  ]);

  // Extract words (3+ characters, not stop words)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !stopWords.has(word));

  // Get unique words, prioritize longer words
  const uniqueWords = Array.from(new Set(words));
  return uniqueWords.slice(0, 15); // Top 15 keywords
}

/**
 * Calculate category matching score
 */
function calculateCategoryMatch(
  caseDetails: CaseDetails,
  opportunity: FundingOpportunity
): number {
  if (!caseDetails.category) return 0.5; // Neutral if no category

  const categoryKeywords: Record<string, string[]> = {
    funding: ['dofinansowanie', 'dotacja', 'grant', 'subwencja', 'fundusz'],
    permits: ['pozwolenie', 'zezwolenie', 'licencja', 'certyfikat'],
    licenses: ['licencja', 'certyfikat', 'uprawnienie', 'autoryzacja'],
  };

  const oppText = `${opportunity.name} ${opportunity.description}`.toLowerCase();
  const relevantKeywords = categoryKeywords[caseDetails.category] || [];

  // Check if opportunity mentions category-related keywords
  const matches = relevantKeywords.filter((keyword) =>
    oppText.includes(keyword)
  ).length;

  return relevantKeywords.length > 0
    ? matches / relevantKeywords.length
    : 0.5;
}

/**
 * Calculate budget compatibility score
 */
function calculateBudgetCompatibility(
  caseDetails: CaseDetails,
  opportunity: FundingOpportunity
): number {
  if (!opportunity.amount_range) return 0.5; // Neutral if no budget info

  // Extract budget from case description
  const budgetMatch = caseDetails.description.match(
    /(\d{1,3}(?:\s?\d{3})*)\s*(?:pln|zł|zloty|zlotych)/i
  );
  if (!budgetMatch) return 0.5; // No budget mentioned

  const caseBudget = parseInt(
    budgetMatch[1].replace(/\s/g, ''),
    10
  );

  // Extract budget range from opportunity
  const rangeMatch = opportunity.amount_range.match(
    /(\d{1,3}(?:\s?\d{3})*)\s*-\s*(\d{1,3}(?:\s?\d{3})*)/i
  );

  if (rangeMatch) {
    const minBudget = parseInt(rangeMatch[1].replace(/\s/g, ''), 10);
    const maxBudget = parseInt(rangeMatch[2].replace(/\s/g, ''), 10);

    if (caseBudget >= minBudget && caseBudget <= maxBudget) {
      return 1.0; // Perfect match
    } else if (caseBudget < minBudget) {
      // Too small, but might be acceptable with own contribution
      return 0.3;
    } else {
      // Too large, less compatible
      return 0.2;
    }
  }

  // Try to extract single amount
  const singleAmountMatch = opportunity.amount_range.match(
    /(\d{1,3}(?:\s?\d{3})*)/i
  );
  if (singleAmountMatch) {
    const oppBudget = parseInt(singleAmountMatch[1].replace(/\s/g, ''), 10);
    const ratio = Math.min(caseBudget, oppBudget) / Math.max(caseBudget, oppBudget);
    return ratio; // Closer amounts = higher score
  }

  return 0.5; // Default neutral
}

