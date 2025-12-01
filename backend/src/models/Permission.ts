import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PermissionAttributes {
  id: number;
  admin_id: number;
  can_view_all_wl: boolean;
  can_view_own_wl: boolean;
  can_create_wl: boolean;
  can_validate_wl: boolean;
  can_refuse_wl: boolean;
  can_pending_wl: boolean;
  can_modify_wl: boolean;
  can_delete_wl: boolean;
  can_manage_templates: boolean;
  can_view_statistics: boolean;
  can_manage_claims: boolean;
  can_access_chat: boolean;
  can_create_tickets: boolean;
  can_manage_admins: boolean;
  created_at: Date;
  updated_at: Date;
}

interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id' | 'created_at' | 'updated_at' | 'can_view_all_wl' | 'can_view_own_wl' | 'can_create_wl' | 'can_validate_wl' | 'can_refuse_wl' | 'can_pending_wl' | 'can_modify_wl' | 'can_delete_wl' | 'can_manage_templates' | 'can_view_statistics' | 'can_manage_claims' | 'can_access_chat' | 'can_create_tickets' | 'can_manage_admins'> {}

class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  public id!: number;
  public admin_id!: number;
  public can_view_all_wl!: boolean;
  public can_view_own_wl!: boolean;
  public can_create_wl!: boolean;
  public can_validate_wl!: boolean;
  public can_refuse_wl!: boolean;
  public can_pending_wl!: boolean;
  public can_modify_wl!: boolean;
  public can_delete_wl!: boolean;
  public can_manage_templates!: boolean;
  public can_view_statistics!: boolean;
  public can_manage_claims!: boolean;
  public can_access_chat!: boolean;
  public can_create_tickets!: boolean;
  public can_manage_admins!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admins',
        key: 'id',
      },
    },
    can_view_all_wl: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_view_own_wl: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    can_create_wl: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_validate_wl: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_refuse_wl: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_pending_wl: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_modify_wl: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_delete_wl: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_manage_templates: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_view_statistics: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_manage_claims: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_access_chat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_create_tickets: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_manage_admins: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Permission;
