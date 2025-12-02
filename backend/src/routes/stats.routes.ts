import express from 'express';
import {
  getDashboardStats,
  getWhitelistStats,
  getAdminStats,
} from '../controllers/stats.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/dashboard', getDashboardStats);
router.get('/whitelists', getWhitelistStats);
router.get('/admins', getAdminStats);

export default router;
