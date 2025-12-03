import express from 'express';
import {
  getAllScenarios,
  createScenario,
  updateScenario,
  deleteScenario,
  validateScenario,
  getAllRuleQuestions,
  createRuleQuestion,
  updateRuleQuestion,
  deleteRuleQuestion,
  validateRuleQuestion,
  getAllLexiconQuestions,
  createLexiconQuestion,
  updateLexiconQuestion,
  deleteLexiconQuestion,
  validateLexiconQuestion,
} from '../controllers/template.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Scenarios
router.get('/scenarios', getAllScenarios);
router.post('/scenarios', createScenario);
router.put('/scenarios/:id', updateScenario);
router.post('/scenarios/:id/validate', validateScenario); // Master admin only
router.delete('/scenarios/:id', deleteScenario);

// Rule Questions
router.get('/rule-questions', getAllRuleQuestions);
router.post('/rule-questions', createRuleQuestion);
router.put('/rule-questions/:id', updateRuleQuestion);
router.post('/rule-questions/:id/validate', validateRuleQuestion); // Master admin only
router.delete('/rule-questions/:id', deleteRuleQuestion);

// Lexicon Questions
router.get('/lexicon-questions', getAllLexiconQuestions);
router.post('/lexicon-questions', createLexiconQuestion);
router.put('/lexicon-questions/:id', updateLexiconQuestion);
router.post('/lexicon-questions/:id/validate', validateLexiconQuestion); // Master admin only
router.delete('/lexicon-questions/:id', deleteLexiconQuestion);

export default router;
