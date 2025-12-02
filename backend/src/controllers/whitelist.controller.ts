import { Request, Response } from 'express';
import Whitelist from '../models/Whitelist';

// Mapping from frontend field names (camelCase) to database column names (snake_case)
const fieldMapping: { [key: string]: string } = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  candidateFirstname: 'candidate_firstname',
  candidateLastname: 'candidate_lastname',
  discordUsername: 'discord_username',
  experienceLevel: 'experience_level',
  rpHours: 'rp_hours',
  categoryId: 'category_id',
  adminId: 'admin_id',
  totalScore: 'total_score',
  scenarioScore: 'scenario_score',
  questionsScore: 'questions_score',
  autoSuggestion: 'auto_suggestion',
  finalDecision: 'final_decision',
  validationComment: 'validation_comment',
  refusalReason: 'refusal_reason',
  pendingReason: 'pending_reason',
  reexamDate: 'reexam_date',
  isTemporaryRefusal: 'is_temporary_refusal',
  interviewStart: 'interview_start',
  interviewEnd: 'interview_end',
  interviewDuration: 'interview_duration',
  adminNotes: 'admin_notes',
};

export const getAllWhitelists = async (req: Request, res: Response) => {
  try {
    const { limit, sort, order, status, category } = req.query;

    // Convert frontend field name to database column name
    const sortField = sort ? (fieldMapping[sort as string] || sort) : 'created_at';

    const queryOptions: any = {
      order: [[sortField as string, order as string || 'DESC']],
    };

    if (limit) {
      queryOptions.limit = parseInt(limit as string);
    }

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category_id = category;

    queryOptions.where = where;

    const whitelists = await Whitelist.findAll(queryOptions);
    return res.json(whitelists);
  } catch (error: any) {
    console.error('Error fetching whitelists:', error);
    return res.status(500).json({ error: 'Failed to fetch whitelists' });
  }
};

export const getWhitelistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const whitelist = await Whitelist.findByPk(id);

    if (!whitelist) {
      return res.status(404).json({ error: 'Whitelist not found' });
    }

    return res.json(whitelist);
  } catch (error: any) {
    console.error('Error fetching whitelist:', error);
    return res.status(500).json({ error: 'Failed to fetch whitelist' });
  }
};

export const createWhitelist = async (req: Request, res: Response) => {
  try {
    const whitelistData = req.body;

    // Age validation
    if (whitelistData.age < 18) {
      return res.status(400).json({
        error: 'Age minimum requis : 18 ans',
        auto_refuse: true,
      });
    }

    // Map category name to category_id
    if (whitelistData.category) {
      whitelistData.category_id = whitelistData.category === 'Legal' ? 1 : 2;
      delete whitelistData.category;
    }

    const admin = (req as any).admin;
    whitelistData.admin_id = admin.id;

    const whitelist = await Whitelist.create(whitelistData);
    return res.status(201).json(whitelist);
  } catch (error: any) {
    console.error('Error creating whitelist:', error);
    return res.status(500).json({ error: 'Failed to create whitelist' });
  }
};

export const updateWhitelist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const whitelist = await Whitelist.findByPk(id);

    if (!whitelist) {
      return res.status(404).json({ error: 'Whitelist not found' });
    }

    await whitelist.update(req.body);
    return res.json(whitelist);
  } catch (error: any) {
    console.error('Error updating whitelist:', error);
    return res.status(500).json({ error: 'Failed to update whitelist' });
  }
};

export const deleteWhitelist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const whitelist = await Whitelist.findByPk(id);

    if (!whitelist) {
      return res.status(404).json({ error: 'Whitelist not found' });
    }

    await whitelist.destroy();
    return res.json({ message: 'Whitelist deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting whitelist:', error);
    return res.status(500).json({ error: 'Failed to delete whitelist' });
  }
};

// Validate (confirm) a whitelist
export const validateWhitelist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { validationComment } = req.body;

    const whitelist = await Whitelist.findByPk(id);

    if (!whitelist) {
      return res.status(404).json({ error: 'Whitelist not found' });
    }

    // Update whitelist status to validated (French: 'validée')
    await whitelist.update({
      status: 'validée',
      final_decision: 'validée',
      validation_comment: validationComment || '',
    });

    return res.json(whitelist);
  } catch (error: any) {
    console.error('Error validating whitelist:', error);
    return res.status(500).json({ error: 'Failed to validate whitelist' });
  }
};

// Refuse a whitelist
export const refuseWhitelist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { refusalReason } = req.body;

    const whitelist = await Whitelist.findByPk(id);

    if (!whitelist) {
      return res.status(404).json({ error: 'Whitelist not found' });
    }

    if (!refusalReason || refusalReason.trim() === '') {
      return res.status(400).json({ error: 'Refusal reason is required' });
    }

    // Update whitelist status to refused (French: 'refusée')
    await whitelist.update({
      status: 'refusée',
      final_decision: 'refusée',
      refusal_reason: refusalReason,
    });

    return res.json(whitelist);
  } catch (error: any) {
    console.error('Error refusing whitelist:', error);
    return res.status(500).json({ error: 'Failed to refuse whitelist' });
  }
};
