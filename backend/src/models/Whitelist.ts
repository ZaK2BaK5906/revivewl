import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

type ExperienceLevel = 'Débutant' | 'Intermédiaire' | 'Expérimenté';
type WLStatus = 'en_cours' | 'validée' | 'refusée' | 'en_attente';
type AutoSuggestion = 'accepter' | 'refuser' | 'en_attente';
type FinalDecision = 'validée' | 'refusée' | 'en_attente';

interface WhitelistAttributes {
  id: number;
  candidate_firstname: string;
  candidate_lastname: string;
  discord_username: string;
  age: number;
  experience_level: ExperienceLevel;
  rp_hours: number;
  category_id: number;
  admin_id: number;
  status: WLStatus;
  total_score: number;
  scenario_score: number;
  questions_score: number;
  auto_suggestion: AutoSuggestion | null;
  final_decision: FinalDecision | null;
  validation_comment: string | null;
  refusal_reason: string | null;
  pending_reason: string | null;
  reexam_date: Date | null;
  is_temporary_refusal: boolean;
  interview_start: Date | null;
  interview_end: Date | null;
  interview_duration: number;
  admin_notes: string | null;
  created_at: Date;
  updated_at: Date;
}

interface WhitelistCreationAttributes extends Optional<WhitelistAttributes, 'id' | 'rp_hours' | 'status' | 'total_score' | 'scenario_score' | 'questions_score' | 'auto_suggestion' | 'final_decision' | 'validation_comment' | 'refusal_reason' | 'pending_reason' | 'reexam_date' | 'is_temporary_refusal' | 'interview_start' | 'interview_end' | 'interview_duration' | 'admin_notes' | 'created_at' | 'updated_at'> {}

class Whitelist extends Model<WhitelistAttributes, WhitelistCreationAttributes> implements WhitelistAttributes {
  public id!: number;
  public candidate_firstname!: string;
  public candidate_lastname!: string;
  public discord_username!: string;
  public age!: number;
  public experience_level!: ExperienceLevel;
  public rp_hours!: number;
  public category_id!: number;
  public admin_id!: number;
  public status!: WLStatus;
  public total_score!: number;
  public scenario_score!: number;
  public questions_score!: number;
  public auto_suggestion!: AutoSuggestion | null;
  public final_decision!: FinalDecision | null;
  public validation_comment!: string | null;
  public refusal_reason!: string | null;
  public pending_reason!: string | null;
  public reexam_date!: Date | null;
  public is_temporary_refusal!: boolean;
  public interview_start!: Date | null;
  public interview_end!: Date | null;
  public interview_duration!: number;
  public admin_notes!: string | null;
  public created_at!: Date;
  public updated_at!: Date;

  public readonly category?: any;
  public readonly admin?: any;
}

Whitelist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    candidate_firstname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    candidate_lastname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    discord_username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 18,
      },
    },
    experience_level: {
      type: DataTypes.ENUM('Débutant', 'Intermédiaire', 'Expérimenté'),
      allowNull: false,
    },
    rp_hours: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'wl_categories',
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
    status: {
      type: DataTypes.ENUM('en_cours', 'validée', 'refusée', 'en_attente'),
      defaultValue: 'en_cours',
    },
    total_score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    scenario_score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    questions_score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    auto_suggestion: {
      type: DataTypes.ENUM('accepter', 'refuser', 'en_attente'),
      allowNull: true,
    },
    final_decision: {
      type: DataTypes.ENUM('validée', 'refusée', 'en_attente'),
      allowNull: true,
    },
    validation_comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refusal_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pending_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reexam_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    is_temporary_refusal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    interview_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    interview_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    interview_duration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'whitelists',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['status'] },
      { fields: ['created_at'] },
      { fields: ['admin_id'] },
    ],
  }
);

export default Whitelist;
