import express from 'express';
import {
  getAllWhitelists,
  getWhitelistById,
  createWhitelist,
  updateWhitelist,
  deleteWhitelist,
} from '../controllers/whitelist.controller';
import { getWhitelistStats } from '../controllers/stats.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getAllWhitelists);
router.get('/stats', getWhitelistStats);
router.get('/:id', getWhitelistById);
router.post('/', createWhitelist);
router.put('/:id', updateWhitelist);
router.delete('/:id', deleteWhitelist);

export default router;
