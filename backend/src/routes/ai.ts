import { Router } from 'express';
import { supabase } from '../config/supabase';
import { classifyCaseAgent } from '../agents/classifier';
import { retrieveProcedures, findBestMatch } from '../agents/retriever';
import { generateGuidance, analyzeRisk, generateDraftDecision, extractFundingOpportunities } from '../services/openai.service';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import logger from '../utils/logger';

const router = Router();

// Analyze case with AI
router.post('/analyze/:caseId', async (req, res) => {
  const { caseId } = req.params;
  try {
    logger.info(`Starting AI analysis for case ${caseId}`);

    // Get case
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (caseError) throw caseError;

    logger.info(`Case retrieved: ${caseData.title}`);

    // Step 1: Classify
    logger.info('Step 1: Classifying case...');
    const classification = await classifyCaseAgent(caseData.description);
    logger.info('Classification complete', { category: classification.category, confidence: classification.confidence });

    // Step 2: Retrieve procedures
    logger.info('Step 2: Retrieving procedures...');
    const procedures = await retrieveProcedures(classification);
    logger.info(`Found ${procedures.length} matching procedures`);

    // Step 3: Find best match
    logger.info('Step 3: Finding best match...');
    const match = await findBestMatch(procedures, {
      ...caseData,
      extractedDetails: classification.extractedDetails,
    });

    if (!match) {
      logger.warn(`No matching procedure found for case ${caseId}`);
      return res.json({
        success: false,
        message: 'Nie znaleziono pasującej procedury',
      });
    }

    logger.info(`Best match found: ${match.procedure.name} (score: ${match.score})`);

    // Step 4: Generate guidance, Risk Analysis & Extract Funding Opportunities
    logger.info('Step 4: Generating AI analysis (Risk, Decision & Funding)...');
    
    const [guidance, riskAnalysis, fundingOpportunities] = await Promise.all([
      generateGuidance(caseData, match.procedure),
      analyzeRisk(caseData, match.procedure),
      extractFundingOpportunities(caseData.description, caseData)
    ]);

    const draftDecision = await generateDraftDecision(caseData, match.procedure, riskAnalysis);

    logger.info('Analysis generated successfully');

    // Store analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('ai_analyses')
      .insert({
        case_id: caseId,
        matched_procedure_id: match.procedure.id,
        confidence_score: match.score,
        reasoning: guidance,
        missing_documents: riskAnalysis.missing_documents || [],
        risk_flags: riskAnalysis.risk_flags || [],
        risk_score: riskAnalysis.risk_score,
        draft_decision: draftDecision.draft_content,
        legal_basis_analysis: draftDecision.legal_basis_analysis,
        recommended_action: riskAnalysis.recommended_action
      })
      .select()
      .single();

    if (analysisError) throw analysisError;

    // Store funding opportunities
    if (fundingOpportunities && fundingOpportunities.length > 0) {
      logger.info(`Storing ${fundingOpportunities.length} funding opportunities`);
      
      const fundingInserts = fundingOpportunities.map((opportunity: any) => ({
        case_id: caseId,
        program_name: opportunity.program_name,
        program_code: opportunity.program_code || null,
        description: opportunity.description,
        funding_amount_min: opportunity.funding_amount_min || null,
        funding_amount_max: opportunity.funding_amount_max || null,
        application_deadline: opportunity.application_deadline || null,
        eligibility_requirements: opportunity.eligibility_requirements || [],
        match_relevance: opportunity.match_relevance || 0.5,
        source_url: opportunity.source_info || null
      }));

      const { error: fundingError } = await supabase
        .from('funding_opportunities')
        .insert(fundingInserts);

      if (fundingError) {
        logger.error('Error storing funding opportunities', { error: fundingError });
      } else {
        logger.info('Funding opportunities stored successfully');
      }
    }

    // Update case
    await supabase
      .from('cases')
      .update({
        assigned_procedure_id: match.procedure.id,
        category: classification.category,
        status: 'in_review',
      })
      .eq('id', caseId);

    logger.info(`AI analysis completed successfully for case ${caseId}`);
    res.json({
      success: true,
      classification,
      procedure: match.procedure,
      guidance,
      analysis,
      fundingOpportunitiesCount: fundingOpportunities?.length || 0,
    });
  } catch (error: any) {
    logger.error('Analysis error', { error: error.message, stack: error.stack, caseId });
    res.status(500).json({ error: error.message });
  }
});

// Get funding opportunities for a case
router.get('/funding/:caseId', async (req, res) => {
  const { caseId } = req.params;
  try {
    logger.info(`Getting funding opportunities for case ${caseId}`);

    const { data: opportunities, error } = await supabase
      .from('funding_opportunities')
      .select('*')
      .eq('case_id', caseId)
      .order('match_relevance', { ascending: false })
      .order('application_deadline', { ascending: true });

    if (error) throw error;

    logger.info(`Found ${opportunities?.length || 0} funding opportunities`);
    res.json({ 
      success: true, 
      opportunities: opportunities || [],
      count: opportunities?.length || 0
    });
  } catch (error: any) {
    logger.error('Funding opportunities error', { error: error.message, stack: error.stack, caseId });
    res.status(500).json({ error: error.message });
  }
});

// Chat with AI about case
router.post('/chat/:caseId', async (req, res) => {
  const { caseId } = req.params;
  try {
    const { message } = req.body;
    logger.info(`Chat message received for case ${caseId}`, { messageLength: message.length });

    // Get case and procedure
    const { data: caseData } = await supabase
      .from('cases')
      .select('*, procedures(*)')
      .eq('id', caseId)
      .single();

    // Get chat history
    const { data: history } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: true });

    // Generate response
    const conversationHistory: ChatCompletionMessageParam[] = history?.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    })) || [];

    conversationHistory.push({ role: 'user', content: message });

    const response = await generateGuidance(
      caseData,
      caseData.procedures,
      conversationHistory
    );

    // Store messages
    await supabase.from('chat_messages').insert([
      { case_id: caseId, role: 'user', content: message },
      { case_id: caseId, role: 'assistant', content: response },
    ]);

    logger.info(`Chat response generated for case ${caseId}`);
    res.json({ response });
  } catch (error: any) {
    logger.error('Chat error', { error: error.message, stack: error.stack, caseId });
    res.status(500).json({ error: error.message });
  }
});

export default router;

