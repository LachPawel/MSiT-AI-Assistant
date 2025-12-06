import { Router } from 'express';
import { supabase } from '../config/supabase';
import logger from '../utils/logger';

const router = Router();

// Create new case
router.post('/', async (req, res) => {
  try {
    const { title, description, applicant_details, user_id } = req.body;
    logger.info('Creating new case', { title, user_id });

    const { data, error } = await supabase
      .from('cases')
      .insert({
        title,
        description,
        applicant_details,
        user_id,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Case created successfully', { caseId: data.id });
    res.json(data);
  } catch (error: any) {
    logger.error('Error creating case', { error: error.message, stack: error.stack });
    res.status(500).json({ error: error.message });
  }
});

// Get all cases
router.get('/', async (req, res) => {
  try {
    logger.info('Fetching all cases');
    const { data, error } = await supabase
      .from('cases')
      .select('*, procedures(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    logger.info(`Retrieved ${data?.length || 0} cases`);
    res.json(data);
  } catch (error: any) {
    logger.error('Error fetching cases', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Get single case
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching case ${id}`);
    
    const { data, error } = await supabase
      .from('cases')
      .select('*, procedures(*), ai_analyses(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    logger.info(`Case ${id} retrieved successfully`);
    res.json(data);
  } catch (error: any) {
    logger.error('Error fetching case', { error: error.message, caseId: req.params.id });
    res.status(500).json({ error: error.message });
  }
});

export default router;

