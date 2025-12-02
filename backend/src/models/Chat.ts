import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class ChatMessage extends Model {
  public id!: number;
  public sender!: string;
  public content!: string;
  public isCurrentUser!: boolean;
  public timestamp!: Date;
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
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isCurrentUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'chat_messages',
    timestamps: true,
  }
);
