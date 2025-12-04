import { Request, Response } from 'express';
import Whitelist from '../models/Whitelist';
import { WlScenarioAnswer, WlRuleAnswer, WlLexiconAnswer, WlFixedAnswer } from '../models/WhitelistAnswers';
import { triggerWebhook } from './webhook.controller';

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
    const whitelist = await Whitelist.findByPk(id, {
      include: [
        {
          model: WlScenarioAnswer,
          as: 'scenarioAnswers',
        },
        {
          model: WlRuleAnswer,
          as: 'ruleAnswers',
        },
        {
          model: WlLexiconAnswer,
          as: 'lexiconAnswers',
        },
        {
          model: WlFixedAnswer,
          as: 'fixedAnswers',
        },
      ],
    });

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
    const {
      candidate_firstname,
      candidate_lastname,
      discord_username,
      age,
      experience_level,
      rp_hours,
      category,
      admin_notes,
      total_score,
      scenario_score,
      questions_score,
      // Answers data
      scenarios,
      ruleQuestions,
      lexiconQuestions,
      fixedAnswers,
    } = req.body;

    // Age validation
    if (age < 18) {
      return res.status(400).json({
        error: 'Age minimum requis : 18 ans',
        auto_refuse: true,
      });
    }

    // Map category name to category_id
    const category_id = category === 'Legal' ? 1 : 2;

    const admin = (req as any).admin;

    // Create whitelist
    const whitelistData = {
      candidate_firstname,
      candidate_lastname,
      discord_username,
      age,
      experience_level,
      rp_hours: rp_hours || 0,
      category_id,
      admin_id: admin.id,
      admin_notes,
      total_score: total_score || 0,
      scenario_score: scenario_score || 0,
      questions_score: questions_score || 0,
    };

    const whitelist = await Whitelist.create(whitelistData);

    // Save scenario answers if provided
    if (scenarios && Array.isArray(scenarios)) {
      for (const scenario of scenarios) {
        if (scenario.answer && scenario.answer.trim() !== '') {
          await WlScenarioAnswer.create({
            whitelist_id: whitelist.id,
            scenario_id: scenario.id,
            answer: scenario.answer,
            is_validated: scenario.validated || false,
            score: scenario.score || 0,
          });
        }
      }
    }

    // Save rule question answers if provided
    if (ruleQuestions && Array.isArray(ruleQuestions)) {
      for (let i = 0; i < ruleQuestions.length; i++) {
        const question = ruleQuestions[i];
        if (question.answer && question.answer.trim() !== '') {
          await WlRuleAnswer.create({
            whitelist_id: whitelist.id,
            question_id: i + 1, // Assuming question IDs are sequential starting from 1
            answer: question.answer,
            is_correct: question.correct || false,
            score: question.correct ? 5 : 0,
          });
        }
      }
    }

    // Save lexicon question answers if provided
    if (lexiconQuestions && Array.isArray(lexiconQuestions)) {
      for (let i = 0; i < lexiconQuestions.length; i++) {
        const question = lexiconQuestions[i];
        if (question.answer && question.answer.trim() !== '') {
          await WlLexiconAnswer.create({
            whitelist_id: whitelist.id,
            question_id: i + 1, // Assuming question IDs are sequential starting from 1
            answer: question.answer,
            is_correct: question.correct || false,
            score: question.correct ? 5 : 0,
          });
        }
      }
    }

    // Save fixed answers if provided
    if (fixedAnswers) {
      if (fixedAnswers.zoneSafe && fixedAnswers.zoneSafe.trim() !== '') {
        await WlFixedAnswer.create({
          whitelist_id: whitelist.id,
          question_type: 'zone_safe',
          answer: fixedAnswers.zoneSafe,
        });
      }
      if (fixedAnswers.passwordHidden && fixedAnswers.passwordHidden.trim() !== '') {
        await WlFixedAnswer.create({
          whitelist_id: whitelist.id,
          question_type: 'password_hidden',
          answer: fixedAnswers.passwordHidden,
        });
      }
      if (fixedAnswers.safeWord && fixedAnswers.safeWord.trim() !== '') {
        await WlFixedAnswer.create({
          whitelist_id: whitelist.id,
          question_type: 'safe_word',
          answer: fixedAnswers.safeWord,
        });
      }
    }

    // Trigger webhook for whitelist creation
    triggerWebhook('wl_created', {
      candidate_firstname: whitelist.candidate_firstname,
      candidate_lastname: whitelist.candidate_lastname,
      discord_username: whitelist.discord_username,
      age: whitelist.age,
    });

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

    // Trigger webhook for whitelist validation
    triggerWebhook('wl_validated', {
      candidate_firstname: whitelist.candidate_firstname,
      candidate_lastname: whitelist.candidate_lastname,
      discord_username: whitelist.discord_username,
      category: whitelist.category_id === 1 ? 'Legal' : 'Illégal',
      total_score: whitelist.total_score,
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

    // Trigger webhook for whitelist refusal
    triggerWebhook('wl_refused', {
      candidate_firstname: whitelist.candidate_firstname,
      candidate_lastname: whitelist.candidate_lastname,
      discord_username: whitelist.discord_username,
      refusal_reason: refusalReason,
    });

    return res.json(whitelist);
  } catch (error: any) {
    console.error('Error refusing whitelist:', error);
    return res.status(500).json({ error: 'Failed to refuse whitelist' });
  }
};
