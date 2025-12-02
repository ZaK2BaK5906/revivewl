import express from 'express';
import {
  getAllMessages,
  sendMessage,
  deleteMessage,
  getOnlineAdmins,
} from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/messages', getAllMessages);
router.post('/messages', sendMessage);
router.delete('/messages/:id', deleteMessage);
router.get('/admins', getOnlineAdmins);

export default router;
