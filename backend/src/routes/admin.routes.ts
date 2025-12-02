import express from 'express';
import {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updatePermissions,
  updateOwnProfile,
} from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getAllAdmins);
router.get('/:id', getAdminById);
router.post('/', createAdmin);
router.put('/me/profile', updateOwnProfile); // Update own profile - must be before /:id routes
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);
router.put('/:id/permissions', updatePermissions);

export default router;
