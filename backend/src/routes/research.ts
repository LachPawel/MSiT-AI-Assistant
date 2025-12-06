import { Router } from 'express';
import { researchPolishProcedures, researchFundingOpportunities } from '../services/exa.service';
import { supabase } from '../config/supabase';
import { openai } from '../services/openai.service';
import logger from '../utils/logger';
import { calculateRelevanceScore, CaseDetails } from '../utils/scoring';

const router = Router();

// Research and populate procedures (admin only)
router.post('/procedures', async (req, res) => {
  try {
    console.log('🔬 Starting procedure research...');

    const results = await researchPolishProcedures();

    console.log(`📚 Found ${results.length} sources`);

    // Use OpenAI to extract structured procedures
    const procedures = [];

    for (const result of results.slice(0, 5)) {
      const extraction = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content:
              'Wyodrębnij procedurę administracyjną z tekstu. Zwróć JSON z: name, category, description, required_documents, eligibility_criteria, steps, avg_processing_days',
          },
          {
            role: 'user',
            content: `Źródło: ${result.url}\n\n${result.text?.substring(0, 3000)}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const procedure = JSON.parse(
        extraction.choices[0].message.content || '{}'
      );

      if (procedure.name) {
        procedures.push({
          ...procedure,
          legal_basis: result.url,
        });
      }
    }

    // Store in database
    const { data, error } = await supabase
      .from('procedures')
      .insert(procedures)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      count: procedures.length,
      procedures: data,
    });
  } catch (error: any) {
    console.error('Research error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Research funding opportunities for a specific case
router.post('/funding/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    logger.info(`Researching funding opportunities for case ${caseId}`);

    // Get case details
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (caseError) throw caseError;

    logger.info(`Case retrieved: ${caseData.title}`);

    // Research funding opportunities
    logger.info('Starting funding research...');
    const rawResults = await researchFundingOpportunities({
      title: caseData.title,
      description: caseData.description,
      category: caseData.category,
    });

    logger.info(`Found ${rawResults.length} raw research results`);

    // Use OpenAI to extract and structure funding opportunities
    const fundingOpportunities = [];

    for (const result of rawResults.slice(0, 8)) {
      try {
        const extraction = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content:
                'Wyodrębnij informacje o programie dofinansowania z tekstu. Zwróć JSON z: name, description, amount_range, eligibility_criteria, deadline, contact_info, url, category. Jeśli nie znajdziesz wszystkich pól, użyj null.',
            },
            {
              role: 'user',
              content: `Źródło: ${result.url}\n\n${result.text?.substring(0, 4000)}`,
            },
          ],
          response_format: { type: 'json_object' },
        });

        const opportunity = JSON.parse(
          extraction.choices[0].message.content || '{}'
        );

        if (opportunity.name) {
          // Calculate precise relevance score with justification
          logger.info(`Calculating relevance score for: ${opportunity.name}`);
          const scoringResult = await calculateRelevanceScore(
            {
              title: caseData.title,
              description: caseData.description,
              category: caseData.category,
              applicant_details: caseData.applicant_details,
            },
            opportunity
          );

          logger.info(`Relevance score calculated: ${scoringResult.score.toFixed(3)} for ${opportunity.name} (expired: ${scoringResult.isExpired})`);

          fundingOpportunities.push({
            ...opportunity,
            source_url: result.url,
            source_title: result.title || '',
            relevance_score: scoringResult.score,
            justification: scoringResult.justification,
            is_expired: scoringResult.isExpired,
          });
        }
      } catch (error) {
        logger.warn(`Error extracting opportunity from ${result.url}`, { error });
        // Still include raw result with calculated score
        const rawOpportunity = {
          name: result.title || 'Program dofinansowania',
          description: result.text?.substring(0, 500) || '',
          source_url: result.url,
          source_title: result.title || '',
        };

        const scoringResult = await calculateRelevanceScore(
          {
            title: caseData.title,
            description: caseData.description,
            category: caseData.category,
          },
          rawOpportunity
        );

        fundingOpportunities.push({
          ...rawOpportunity,
          relevance_score: scoringResult.score,
          justification: scoringResult.justification,
          is_expired: scoringResult.isExpired,
        });
      }
    }

    // Sort by relevance score (highest first)
    fundingOpportunities.sort((a, b) => b.relevance_score - a.relevance_score);

    logger.info(`Extracted ${fundingOpportunities.length} funding opportunities`);

    res.json({
      success: true,
      count: fundingOpportunities.length,
      opportunities: fundingOpportunities,
    });
  } catch (error: any) {
    logger.error('Funding research error', {
      error: error.message,
      stack: error.stack,
      caseId: req.params.caseId,
    });
    res.status(500).json({ error: error.message });
  }
});

export default router;

