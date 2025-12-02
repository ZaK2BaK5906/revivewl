import { Request, Response } from 'express';
import { Scenario, RuleQuestion, LexiconQuestion } from '../models/Template';

// Scenarios
export const getAllScenarios = async (_req: Request, res: Response) => {
  try {
    const scenarios = await Scenario.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(scenarios);
  } catch (error: any) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({ error: 'Failed to fetch scenarios' });
  }
};

export const createScenario = async (req: Request, res: Response) => {
  try {
    const scenario = await Scenario.create(req.body);
    res.status(201).json(scenario);
  } catch (error: any) {
    console.error('Error creating scenario:', error);
    res.status(500).json({ error: 'Failed to create scenario' });
  }
};

export const updateScenario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const scenario = await Scenario.findByPk(id);

    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    await scenario.update(req.body);
    res.json(scenario);
  } catch (error: any) {
    console.error('Error updating scenario:', error);
    res.status(500).json({ error: 'Failed to update scenario' });
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
    res.json({ message: 'Scenario deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting scenario:', error);
    res.status(500).json({ error: 'Failed to delete scenario' });
  }
};

// Rule Questions
export const getAllRuleQuestions = async (_req: Request, res: Response) => {
  try {
    const questions = await RuleQuestion.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(questions);
  } catch (error: any) {
    console.error('Error fetching rule questions:', error);
    res.status(500).json({ error: 'Failed to fetch rule questions' });
  }
};

export const createRuleQuestion = async (req: Request, res: Response) => {
  try {
    const question = await RuleQuestion.create(req.body);
    res.status(201).json(question);
  } catch (error: any) {
    console.error('Error creating rule question:', error);
    res.status(500).json({ error: 'Failed to create rule question' });
  }
};

export const updateRuleQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await RuleQuestion.findByPk(id);

    if (!question) {
      return res.status(404).json({ error: 'Rule question not found' });
    }

    await question.update(req.body);
    res.json(question);
  } catch (error: any) {
    console.error('Error updating rule question:', error);
    res.status(500).json({ error: 'Failed to update rule question' });
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
    res.json({ message: 'Rule question deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting rule question:', error);
    res.status(500).json({ error: 'Failed to delete rule question' });
  }
};

// Lexicon Questions
export const getAllLexiconQuestions = async (_req: Request, res: Response) => {
  try {
    const questions = await LexiconQuestion.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(questions);
  } catch (error: any) {
    console.error('Error fetching lexicon questions:', error);
    res.status(500).json({ error: 'Failed to fetch lexicon questions' });
  }
};

export const createLexiconQuestion = async (req: Request, res: Response) => {
  try {
    const question = await LexiconQuestion.create(req.body);
    res.status(201).json(question);
  } catch (error: any) {
    console.error('Error creating lexicon question:', error);
    res.status(500).json({ error: 'Failed to create lexicon question' });
  }
};

export const updateLexiconQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await LexiconQuestion.findByPk(id);

    if (!question) {
      return res.status(404).json({ error: 'Lexicon question not found' });
    }

    await question.update(req.body);
    res.json(question);
  } catch (error: any) {
    console.error('Error updating lexicon question:', error);
    res.status(500).json({ error: 'Failed to update lexicon question' });
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
    res.json({ message: 'Lexicon question deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting lexicon question:', error);
    res.status(500).json({ error: 'Failed to delete lexicon question' });
  }
};
