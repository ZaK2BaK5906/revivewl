import { Request, Response } from 'express';
import Admin from '../models/Admin';
import Permission from '../models/Permission';
import bcrypt from 'bcryptjs';

// Helper function to transform backend admin to frontend format
const transformAdminForFrontend = async (admin: any) => {
  const adminData = admin.toJSON();

  // Fetch permissions for this admin
  const permission = await Permission.findOne({ where: { admin_id: admin.id } });

  // Map permissions to frontend format
  const permissions = permission ? {
    whitelistCreate: permission.can_create_wl,
    whitelistEdit: permission.can_modify_wl,
    whitelistDelete: permission.can_delete_wl,
    whitelistView: permission.can_view_all_wl || permission.can_view_own_wl,
    templateManage: permission.can_manage_templates,
    adminManage: permission.can_manage_admins,
    chatAccess: permission.can_access_chat,
    ticketManage: permission.can_create_tickets,
    settingsManage: false,
    rulesEdit: false,
    statisticsView: permission.can_view_statistics,
    backupManage: false,
    webhookManage: false,
    logsView: false,
  } : {
    whitelistCreate: false,
    whitelistEdit: false,
    whitelistDelete: false,
    whitelistView: true,
    templateManage: false,
    adminManage: false,
    chatAccess: true,
    ticketManage: false,
    settingsManage: false,
    rulesEdit: false,
    statisticsView: false,
    backupManage: false,
    webhookManage: false,
    logsView: false,
  };

  // Map is_master to role
  const role = adminData.is_master ? 'Master Admin' : 'Modérateur';

  return {
    id: adminData.id,
    username: adminData.username,
    email: adminData.email,
    role,
    createdAt: adminData.created_at,
    lastLogin: adminData.last_login || adminData.created_at,
    permissions,
  };
};

export const getAllAdmins = async (_req: Request, res: Response) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']],
    });

    // Transform all admins to frontend format
    const transformedAdmins = await Promise.all(
      admins.map(admin => transformAdminForFrontend(admin))
    );

    return res.json(transformedAdmins);
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

    const transformedAdmin = await transformAdminForFrontend(admin);
    return res.json(transformedAdmin);
  } catch (error: any) {
    console.error('Error fetching admin:', error);
    return res.status(500).json({ error: 'Failed to fetch admin' });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      where: { username },
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Map role to is_master
    const is_master = role === 'Master Admin';

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password_hash: hashedPassword,
      is_master,
    });

    // Create default permissions for new admin
    await Permission.create({
      admin_id: admin.id,
      can_view_own_wl: true,
      can_view_all_wl: is_master,
      can_create_wl: is_master,
      can_validate_wl: is_master,
      can_refuse_wl: is_master,
      can_pending_wl: is_master,
      can_modify_wl: is_master,
      can_delete_wl: is_master,
      can_manage_templates: is_master,
      can_view_statistics: is_master,
      can_manage_claims: is_master,
      can_access_chat: true,
      can_create_tickets: true,
      can_manage_admins: is_master,
    });

    const transformedAdmin = await transformAdminForFrontend(admin);
    return res.status(201).json(transformedAdmin);
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

    // Map role to is_master if role is provided
    if (updateData.role) {
      updateData.is_master = updateData.role === 'Master Admin';
      delete updateData.role;
    }

    await admin.update(updateData);

    const transformedAdmin = await transformAdminForFrontend(admin);
    return res.json(transformedAdmin);
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
    const frontendPermissions = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Map frontend permission names to backend field names
    const backendPermissions = {
      can_view_all_wl: frontendPermissions.whitelistView,
      can_view_own_wl: frontendPermissions.whitelistView,
      can_create_wl: frontendPermissions.whitelistCreate,
      can_validate_wl: frontendPermissions.whitelistEdit,
      can_refuse_wl: frontendPermissions.whitelistEdit,
      can_pending_wl: frontendPermissions.whitelistEdit,
      can_modify_wl: frontendPermissions.whitelistEdit,
      can_delete_wl: frontendPermissions.whitelistDelete,
      can_manage_templates: frontendPermissions.templateManage,
      can_view_statistics: frontendPermissions.statisticsView,
      can_manage_claims: frontendPermissions.ticketManage,
      can_access_chat: frontendPermissions.chatAccess,
      can_create_tickets: frontendPermissions.ticketManage,
      can_manage_admins: frontendPermissions.adminManage,
    };

    // Find or create permissions for this admin
    let permission = await Permission.findOne({ where: { admin_id: id } });

    if (permission) {
      await permission.update(backendPermissions);
    } else {
      permission = await Permission.create({
        admin_id: parseInt(id),
        ...backendPermissions,
      });
    }

    // Return the updated admin with transformed permissions
    const transformedAdmin = await transformAdminForFrontend(admin);
    return res.json(transformedAdmin);
  } catch (error: any) {
    console.error('Error updating permissions:', error);
    return res.status(500).json({ error: 'Failed to update permissions' });
  }
};
