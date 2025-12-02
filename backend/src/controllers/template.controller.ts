import { Request, Response } from 'express';
import { Scenario, RuleQuestion, LexiconQuestion } from '../models/Template';

// Helper: Convert category name to category_id
const getCategoryIdFromName = (categoryName: string): number => {
  // Based on SQL: 1 = Legal, 2 = Illégal
  return categoryName === 'Legal' ? 1 : 2;
};

// Scenarios
export const getAllScenarios = async (_req: Request, res: Response) => {
  try {
    const scenarios = await Scenario.findAll({
      order: [['created_at', 'DESC']],
    });
    return res.json(scenarios);
  } catch (error: any) {
    console.error('Error fetching scenarios:', error);
    return res.status(500).json({ error: 'Failed to fetch scenarios' });
  }
};

export const createScenario = async (req: Request, res: Response) => {
  try {
    const { title, description, expectedAnswer, category } = req.body;

    // Transform frontend data to backend format
    const scenarioData = {
      title,
      description,
      expected_answer: expectedAnswer, // camelCase → snake_case
      category_id: category ? getCategoryIdFromName(category) : 1, // Convert name to ID
      points: 10, // Default value
      is_active: true, // Default value
    };

    const scenario = await Scenario.create(scenarioData);
    return res.status(201).json(scenario);
  } catch (error: any) {
    console.error('Error creating scenario:', error);
    return res.status(500).json({ error: 'Failed to create scenario' });
  }
};

export const updateScenario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const scenario = await Scenario.findByPk(id);

    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    // Transform frontend data if present
    const updateData: any = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.expectedAnswer) updateData.expected_answer = req.body.expectedAnswer;
    if (req.body.category) updateData.category_id = getCategoryIdFromName(req.body.category);
    if (req.body.points !== undefined) updateData.points = req.body.points;
    if (req.body.is_active !== undefined) updateData.is_active = req.body.is_active;

    await scenario.update(updateData);
    return res.json(scenario);
  } catch (error: any) {
    console.error('Error updating scenario:', error);
    return res.status(500).json({ error: 'Failed to update scenario' });
  }
};

export const deleteScenario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const scenario = await Scenario.findByPk(id);

    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    await scenario.destroy();
    return res.json({ message: 'Scenario deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting scenario:', error);
    return res.status(500).json({ error: 'Failed to delete scenario' });
  }
};

// Rule Questions
export const getAllRuleQuestions = async (_req: Request, res: Response) => {
  try {
    const questions = await RuleQuestion.findAll({
      order: [['created_at', 'DESC']],
    });
    return res.json(questions);
  } catch (error: any) {
    console.error('Error fetching rule questions:', error);
    return res.status(500).json({ error: 'Failed to fetch rule questions' });
  }
};

export const createRuleQuestion = async (req: Request, res: Response) => {
  try {
    const { question, answer, points, category } = req.body;

    // Transform frontend data to backend format
    const questionData = {
      question,
      correct_answer: answer, // 'answer' → 'correct_answer'
      category_id: category ? getCategoryIdFromName(category) : null,
      points: points || 5,
      is_active: true,
    };

    const ruleQuestion = await RuleQuestion.create(questionData);
    return res.status(201).json(ruleQuestion);
  } catch (error: any) {
    console.error('Error creating rule question:', error);
    return res.status(500).json({ error: 'Failed to create rule question' });
  }
};

export const updateRuleQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await RuleQuestion.findByPk(id);

    if (!question) {
      return res.status(404).json({ error: 'Rule question not found' });
    }

    // Transform frontend data if present
    const updateData: any = {};
    if (req.body.question) updateData.question = req.body.question;
    if (req.body.answer) updateData.correct_answer = req.body.answer;
    if (req.body.category) updateData.category_id = getCategoryIdFromName(req.body.category);
    if (req.body.points !== undefined) updateData.points = req.body.points;
    if (req.body.is_active !== undefined) updateData.is_active = req.body.is_active;

    await question.update(updateData);
    return res.json(question);
  } catch (error: any) {
    console.error('Error updating rule question:', error);
    return res.status(500).json({ error: 'Failed to update rule question' });
  }
};

export const deleteRuleQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await RuleQuestion.findByPk(id);

    if (!question) {
      return res.status(404).json({ error: 'Rule question not found' });
    }

    await question.destroy();
    return res.json({ message: 'Rule question deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting rule question:', error);
    return res.status(500).json({ error: 'Failed to delete rule question' });
  }
};

// Lexicon Questions
export const getAllLexiconQuestions = async (_req: Request, res: Response) => {
  try {
    const questions = await LexiconQuestion.findAll({
      order: [['created_at', 'DESC']],
    });
    return res.json(questions);
  } catch (error: any) {
    console.error('Error fetching lexicon questions:', error);
    return res.status(500).json({ error: 'Failed to fetch lexicon questions' });
  }
};

export const createLexiconQuestion = async (req: Request, res: Response) => {
  try {
    const { question, answer, points, category } = req.body;

    // Transform frontend data to backend format
    const questionData = {
      question,
      correct_answer: answer, // 'answer' → 'correct_answer'
      category_id: category ? getCategoryIdFromName(category) : null,
      points: points || 5,
      is_active: true,
    };

    const lexiconQuestion = await LexiconQuestion.create(questionData);
    return res.status(201).json(lexiconQuestion);
  } catch (error: any) {
    console.error('Error creating lexicon question:', error);
    return res.status(500).json({ error: 'Failed to create lexicon question' });
  }
};

export const updateLexiconQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await LexiconQuestion.findByPk(id);

    if (!question) {
      return res.status(404).json({ error: 'Lexicon question not found' });
    }

    // Transform frontend data if present
    const updateData: any = {};
    if (req.body.question) updateData.question = req.body.question;
    if (req.body.answer) updateData.correct_answer = req.body.answer;
    if (req.body.category) updateData.category_id = getCategoryIdFromName(req.body.category);
    if (req.body.points !== undefined) updateData.points = req.body.points;
    if (req.body.is_active !== undefined) updateData.is_active = req.body.is_active;

    await question.update(updateData);
    return res.json(question);
  } catch (error: any) {
    console.error('Error updating lexicon question:', error);
    return res.status(500).json({ error: 'Failed to update lexicon question' });
  }
};

export const deleteLexiconQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await LexiconQuestion.findByPk(id);

    if (!question) {
      return res.status(404).json({ error: 'Lexicon question not found' });
    }

    await question.destroy();
    return res.json({ message: 'Lexicon question deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting lexicon question:', error);
    return res.status(500).json({ error: 'Failed to delete lexicon question' });
  }
};
