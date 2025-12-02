import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class ChatMessage extends Model {
  public id!: number;
  public admin_id!: number;
  public room!: string;
  public message!: string;
  public attachments!: string | null;
  public is_edited!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ChatMessage.init(
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
    room: {
      type: DataTypes.STRING(50),
      defaultValue: 'general',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'chat_messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
