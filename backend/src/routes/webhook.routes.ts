import { Router } from 'express';
import {
  getAllWebhooks,
  getWebhookById,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  testWebhook,
} from '../controllers/webhook.controller';
import { authenticate, requireMasterAdmin } from '../middleware/auth';

const router = Router();

// All webhook routes require authentication and master admin
router.use(authenticate);
router.use(requireMasterAdmin);

// Webhook routes
router.get('/', getAllWebhooks);
router.get('/:id', getWebhookById);
router.post('/', createWebhook);
router.put('/:id', updateWebhook);
router.delete('/:id', deleteWebhook);
router.post('/:id/test', testWebhook);

export default router;
