import { Router } from 'express';
import { supabase } from '../config/supabase';
import { classifyCaseAgent } from '../agents/classifier';
import { retrieveProcedures, findBestMatch } from '../agents/retriever';
import { generateGuidance } from '../services/openai.service';
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

    // Step 4: Generate guidance
    logger.info('Step 4: Generating AI guidance...');
    const guidance = await generateGuidance(caseData, match.procedure);
    logger.info('Guidance generated successfully');

    // Store analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('ai_analyses')
      .insert({
        case_id: caseId,
        matched_procedure_id: match.procedure.id,
        confidence_score: match.score,
        reasoning: guidance,
        missing_documents: [],
        risk_flags: [],
      })
      .select()
      .single();

    if (analysisError) throw analysisError;

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
    });
  } catch (error: any) {
    logger.error('Analysis error', { error: error.message, stack: error.stack, caseId });
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

