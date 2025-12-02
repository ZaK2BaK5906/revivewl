import { Request, Response } from 'express';
import Admin from '../models/Admin';
import Permission from '../models/Permission';
import bcrypt from 'bcryptjs';

export const getAllAdmins = async (_req: Request, res: Response) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']],
    });
    return res.json(admins);
  } catch (error: any) {
    console.error('Error fetching admins:', error);
    return res.status(500).json({ error: 'Failed to fetch admins' });
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    return res.json(admin);
  } catch (error: any) {
    console.error('Error fetching admin:', error);
    return res.status(500).json({ error: 'Failed to fetch admin' });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { username, email, password, is_master } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      where: { username },
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password_hash: hashedPassword,
      is_master: is_master || false,
    });

    const adminResponse = admin.toJSON() as any;
    delete adminResponse.password_hash;

    return res.status(201).json(adminResponse);
  } catch (error: any) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ error: 'Failed to create admin' });
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password_hash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }

    await admin.update(updateData);

    const adminResponse = admin.toJSON() as any;
    delete adminResponse.password_hash;

    return res.json(adminResponse);
  } catch (error: any) {
    console.error('Error updating admin:', error);
    return res.status(500).json({ error: 'Failed to update admin' });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    await admin.destroy();
    return res.json({ message: 'Admin deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting admin:', error);
    return res.status(500).json({ error: 'Failed to delete admin' });
  }
};

export const updatePermissions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const permissionsData = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Find or create permissions for this admin
    let permission = await Permission.findOne({ where: { admin_id: id } });

    if (permission) {
      await permission.update(permissionsData);
    } else {
      permission = await Permission.create({
        admin_id: parseInt(id),
        ...permissionsData,
      });
    }

    return res.json(permission);
  } catch (error: any) {
    console.error('Error updating permissions:', error);
    return res.status(500).json({ error: 'Failed to update permissions' });
  }
};
