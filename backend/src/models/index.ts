import Admin from './Admin';
import Permission from './Permission';
import Whitelist from './Whitelist';
import { WlScenarioAnswer, WlRuleAnswer, WlLexiconAnswer, WlFixedAnswer } from './WhitelistAnswers';
import sequelize from '../config/database';

// Define associations
Admin.hasOne(Permission, { foreignKey: 'admin_id', as: 'permissions' });
Permission.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });

Admin.hasMany(Whitelist, { foreignKey: 'admin_id', as: 'whitelists' });
Whitelist.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });

// Whitelist answer associations
Whitelist.hasMany(WlScenarioAnswer, { foreignKey: 'whitelist_id', as: 'scenarioAnswers' });
WlScenarioAnswer.belongsTo(Whitelist, { foreignKey: 'whitelist_id', as: 'whitelist' });

Whitelist.hasMany(WlRuleAnswer, { foreignKey: 'whitelist_id', as: 'ruleAnswers' });
WlRuleAnswer.belongsTo(Whitelist, { foreignKey: 'whitelist_id', as: 'whitelist' });

Whitelist.hasMany(WlLexiconAnswer, { foreignKey: 'whitelist_id', as: 'lexiconAnswers' });
WlLexiconAnswer.belongsTo(Whitelist, { foreignKey: 'whitelist_id', as: 'whitelist' });

Whitelist.hasMany(WlFixedAnswer, { foreignKey: 'whitelist_id', as: 'fixedAnswers' });
WlFixedAnswer.belongsTo(Whitelist, { foreignKey: 'whitelist_id', as: 'whitelist' });

export {
  Admin,
  Permission,
  Whitelist,
  WlScenarioAnswer,
  WlRuleAnswer,
  WlLexiconAnswer,
  WlFixedAnswer,
  sequelize,
};

export default {
  Admin,
  Permission,
  Whitelist,
  WlScenarioAnswer,
  WlRuleAnswer,
  WlLexiconAnswer,
  WlFixedAnswer,
  sequelize,
};
