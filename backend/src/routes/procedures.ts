import { Router } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

// Get all procedures
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('procedures')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create procedure (admin)
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('procedures')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

