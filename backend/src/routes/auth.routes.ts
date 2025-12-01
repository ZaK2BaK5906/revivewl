import { Router } from 'express';
import { login, logout, me, verify2FA, enable2FA, disable2FA } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);
router.post('/verify-2fa', verify2FA);
router.post('/enable-2fa', authenticate, enable2FA);
router.post('/disable-2fa', authenticate, disable2FA);

export default router;
