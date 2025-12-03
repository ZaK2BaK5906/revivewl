import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// ============================================
// Discord Webhooks Model
// ============================================

type WebhookEvent = 'wl_validated' | 'wl_refused' | 'wl_created' | 'ticket_created' | 'admin_action';

interface WebhookAttributes {
  id: number;
  name: string;
  webhook_url: string;
  event_type: WebhookEvent;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface WebhookCreationAttributes extends Optional<WebhookAttributes, 'id' | 'is_active' | 'created_at' | 'updated_at'> {}

export class DiscordWebhook extends Model<WebhookAttributes, WebhookCreationAttributes> implements WebhookAttributes {
  public id!: number;
  public name!: string;
  public webhook_url!: string;
  public event_type!: WebhookEvent;
  public is_active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

DiscordWebhook.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    webhook_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    event_type: {
      type: DataTypes.ENUM('wl_validated', 'wl_refused', 'wl_created', 'ticket_created', 'admin_action'),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: 'discord_webhooks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// ============================================
// Webhook Logs Model
// ============================================

interface WebhookLogAttributes {
  id: number;
  webhook_id: number;
  payload: string;
  response_status: number | null;
  response_body: string | null;
  created_at: Date;
}

interface WebhookLogCreationAttributes extends Optional<WebhookLogAttributes, 'id' | 'response_status' | 'response_body' | 'created_at'> {}

export class WebhookLog extends Model<WebhookLogAttributes, WebhookLogCreationAttributes> implements WebhookLogAttributes {
  public id!: number;
  public webhook_id!: number;
  public payload!: string;
  public response_status!: number | null;
  public response_body!: string | null;
  public created_at!: Date;
}

WebhookLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    webhook_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'discord_webhooks',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    payload: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    response_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    response_body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'webhook_logs',
    timestamps: false,
  }
);

// Associations
DiscordWebhook.hasMany(WebhookLog, { foreignKey: 'webhook_id', as: 'logs' });
WebhookLog.belongsTo(DiscordWebhook, { foreignKey: 'webhook_id', as: 'webhook' });

export default { DiscordWebhook, WebhookLog };
