import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

// Scenario Model
export class Scenario extends Model {
  public id!: number;
  public category_id!: number;
  public title!: string;
  public description!: string;
  public expected_answer!: string | null;
  public points!: number;
  public is_active!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Scenario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'wl_categories',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expected_answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'scenarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Rule Question Model
export class RuleQuestion extends Model {
  public id!: number;
  public question!: string;
  public correct_answer!: string;
  public category_id!: number | null;
  public points!: number;
  public is_active!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

RuleQuestion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    correct_answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'wl_categories',
        key: 'id',
      },
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'rule_questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Lexicon Question Model
export class LexiconQuestion extends Model {
  public id!: number;
  public question!: string;
  public correct_answer!: string;
  public category_id!: number | null;
  public points!: number;
  public is_active!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

LexiconQuestion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    correct_answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'wl_categories',
        key: 'id',
      },
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'lexicon_questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
