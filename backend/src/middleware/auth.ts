import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin, Permission } from '../models';

export interface AuthRequest extends Request {
  admin?: any;
  permissions?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    const admin = await Admin.findByPk(decoded.id, {
      include: [{ model: Permission, as: 'permissions' }],
    });

    if (!admin || !admin.is_active) {
      res.status(401).json({ error: 'Invalid or inactive admin account' });
      return;
    }

    req.admin = admin;
    req.permissions = admin.permissions;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireMasterAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.admin?.is_master) {
    res.status(403).json({ error: 'Master admin access required' });
    return;
  }
  next();
};

export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.admin?.is_master) {
      next();
      return;
    }

    if (!req.permissions || !req.permissions[permission]) {
      res.status(403).json({ error: `Permission ${permission} required` });
      return;
    }

    next();
  };
};
