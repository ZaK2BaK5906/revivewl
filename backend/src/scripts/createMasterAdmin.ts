import { Admin, Permission } from '../models';
import crypto from 'crypto';

const createMasterAdmin = async () => {
  try {
    // Check if master admin already exists
    const existingMaster = await Admin.findOne({ where: { is_master: true } });

    if (existingMaster) {
      console.log('❌ Master admin already exists!');
      console.log(`Username: ${existingMaster.username}`);
      console.log(`Email: ${existingMaster.email}`);
      process.exit(0);
    }

    // Generate random password
    const password = crypto.randomBytes(16).toString('hex');
    const passwordHash = await Admin.hashPassword(password);

    // Create master admin
    const masterAdmin = await Admin.create({
      username: 'admin',
      email: 'admin@revive-rp.local',
      password_hash: passwordHash,
      is_master: true,
      is_active: true,
    });

    // Create permissions (all true for master admin)
    await Permission.create({
      admin_id: masterAdmin.id,
      can_view_all_wl: true,
      can_view_own_wl: true,
      can_create_wl: true,
      can_validate_wl: true,
      can_refuse_wl: true,
      can_pending_wl: true,
      can_modify_wl: true,
      can_delete_wl: true,
      can_manage_templates: true,
      can_view_statistics: true,
      can_manage_claims: true,
      can_access_chat: true,
      can_create_tickets: true,
      can_manage_admins: true,
    });

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   ✅ MASTER ADMIN CREATED            ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log('Username:', masterAdmin.username);
    console.log('Email:', masterAdmin.email);
    console.log('Password:', password);
    console.log('\n⚠️  IMPORTANT: Save this password! It will not be shown again.');
    console.log('⚠️  Please change it after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('Error creating master admin:', error);
    process.exit(1);
  }
};

createMasterAdmin();
