import Admin from './Admin';
import Permission from './Permission';
import Whitelist from './Whitelist';
import sequelize from '../config/database';

// Define associations
Admin.hasOne(Permission, { foreignKey: 'admin_id', as: 'permissions' });
Permission.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });

Admin.hasMany(Whitelist, { foreignKey: 'admin_id', as: 'whitelists' });
Whitelist.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });

export {
  Admin,
  Permission,
  Whitelist,
  sequelize,
};

export default {
  Admin,
  Permission,
  Whitelist,
  sequelize,
};
