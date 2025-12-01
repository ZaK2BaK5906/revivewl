import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

interface AdminAttributes {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  is_master: boolean;
  avatar_url: string | null;
  two_fa_secret: string | null;
  two_fa_enabled: boolean;
  is_active: boolean;
  last_login: Date | null;
  created_at: Date;
  created_by: number | null;
  updated_at: Date;
}

interface AdminCreationAttributes extends Optional<AdminAttributes, 'id' | 'avatar_url' | 'two_fa_secret' | 'two_fa_enabled' | 'is_active' | 'last_login' | 'created_at' | 'created_by' | 'updated_at' | 'is_master'> {}

class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password_hash!: string;
  public is_master!: boolean;
  public avatar_url!: string | null;
  public two_fa_secret!: string | null;
  public two_fa_enabled!: boolean;
  public is_active!: boolean;
  public last_login!: Date | null;
  public created_at!: Date;
  public created_by!: number | null;
  public updated_at!: Date;

  public readonly permissions?: any;

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }

  public static async hashPassword(password: string): Promise<string> {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    return bcrypt.hash(password, rounds);
  }
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_master: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    two_fa_secret: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    two_fa_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'admins',
        key: 'id',
      },
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'admins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Admin;
