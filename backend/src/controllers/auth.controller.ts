import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { Admin, Permission } from '../models';
import { AuthRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const admin = await Admin.findOne({
      where: { username },
      include: [{ model: Permission, as: 'permissions' }],
    });

    if (!admin || !admin.is_active) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await admin.comparePassword(password);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // If 2FA is enabled, return temporary token
    if (admin.two_fa_enabled) {
      const jwtSecret = process.env.JWT_SECRET || 'secret';
      const tempToken = jwt.sign(
        { id: admin.id, temp: true },
        jwtSecret,
        { expiresIn: '5m' } as jwt.SignOptions
      );

      res.json({
        requiresTwoFactor: true,
        tempToken,
      });
      return;
    }

    // Update last login
    await admin.update({ last_login: new Date() });

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        is_master: admin.is_master,
        avatar_url: admin.avatar_url,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verify2FA = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tempToken, code } = req.body;

    if (!tempToken || !code) {
      res.status(400).json({ error: 'Temp token and code are required' });
      return;
    }

    const decoded: any = jwt.verify(tempToken, process.env.JWT_SECRET || 'secret');

    if (!decoded.temp) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const admin = await Admin.findByPk(decoded.id, {
      include: [{ model: Permission, as: 'permissions' }],
    });

    if (!admin || !admin.two_fa_secret) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const verified = speakeasy.totp.verify({
      secret: admin.two_fa_secret,
      encoding: 'base32',
      token: code,
    });

    if (!verified) {
      res.status(401).json({ error: 'Invalid 2FA code' });
      return;
    }

    // Update last login
    await admin.update({ last_login: new Date() });

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        is_master: admin.is_master,
        avatar_url: admin.avatar_url,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const enable2FA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admin = req.admin;

    if (admin.two_fa_enabled) {
      res.status(400).json({ error: '2FA is already enabled' });
      return;
    }

    const secret = speakeasy.generateSecret({
      name: `Revive RP (${admin.username})`,
      length: 32,
    });

    await admin.update({ two_fa_secret: secret.base32 });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    res.json({
      secret: secret.base32,
      qrCode,
    });
  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const disable2FA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admin = req.admin;
    const { code } = req.body;

    if (!admin.two_fa_enabled) {
      res.status(400).json({ error: '2FA is not enabled' });
      return;
    }

    const verified = speakeasy.totp.verify({
      secret: admin.two_fa_secret!,
      encoding: 'base32',
      token: code,
    });

    if (!verified) {
      res.status(401).json({ error: 'Invalid 2FA code' });
      return;
    }

    await admin.update({
      two_fa_enabled: false,
      two_fa_secret: null,
    });

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  // In a real app, you might want to blacklist the token
  res.json({ message: 'Logged out successfully' });
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      include: [{ model: Permission, as: 'permissions' }],
      attributes: { exclude: ['password_hash', 'two_fa_secret'] },
    });

    res.json({ admin });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
