import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class Ticket extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public type!: string;
  public status!: string;
  public priority!: string;
  public created_by!: number;
  public assigned_to!: number | null;
  public resolved_at!: Date | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('Bug', 'Question', 'Suggestion', 'Autre'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Ouvert', 'En cours', 'Résolu', 'Fermé'),
      defaultValue: 'Ouvert',
    },
    priority: {
      type: DataTypes.ENUM('Basse', 'Normale', 'Haute', 'Urgente'),
      defaultValue: 'Normale',
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admins',
        key: 'id',
      },
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'admins',
        key: 'id',
      },
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'tickets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export class TicketComment extends Model {
  public id!: number;
  public ticket_id!: number;
  public admin_id!: number;
  public comment!: string;
  public attachments!: string | null;
  public createdAt!: Date;
}

TicketComment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tickets',
        key: 'id',
      },
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admins',
        key: 'id',
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'ticket_comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

Ticket.hasMany(TicketComment, { foreignKey: 'ticket_id', as: 'comments' });
TicketComment.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
