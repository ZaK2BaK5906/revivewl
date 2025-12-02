import express from 'express';
import {
  getAllScenarios,
  createScenario,
  updateScenario,
  deleteScenario,
  getAllRuleQuestions,
  createRuleQuestion,
  updateRuleQuestion,
  deleteRuleQuestion,
  getAllLexiconQuestions,
  createLexiconQuestion,
  updateLexiconQuestion,
  deleteLexiconQuestion,
} from '../controllers/template.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Scenarios
router.get('/scenarios', getAllScenarios);
router.post('/scenarios', createScenario);
router.put('/scenarios/:id', updateScenario);
router.delete('/scenarios/:id', deleteScenario);

// Rule Questions
router.get('/rule-questions', getAllRuleQuestions);
router.post('/rule-questions', createRuleQuestion);
router.put('/rule-questions/:id', updateRuleQuestion);
router.delete('/rule-questions/:id', deleteRuleQuestion);

// Lexicon Questions
router.get('/lexicon-questions', getAllLexiconQuestions);
router.post('/lexicon-questions', createLexiconQuestion);
router.put('/lexicon-questions/:id', updateLexiconQuestion);
router.delete('/lexicon-questions/:id', deleteLexiconQuestion);

export default router;
