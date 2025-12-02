import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

// Scenario Model
export class Scenario extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public expectedAnswer!: string;
  public category!: string;
  public difficulty!: string;
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expectedAnswer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'scenarios',
    timestamps: true,
  }
);

// Rule Question Model
export class RuleQuestion extends Model {
  public id!: number;
  public question!: string;
  public answer!: string;
  public points!: number;
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
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
  },
  {
    sequelize,
    tableName: 'rule_questions',
    timestamps: true,
  }
);

// Lexicon Question Model
export class LexiconQuestion extends Model {
  public id!: number;
  public question!: string;
  public answer!: string;
  public points!: number;
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
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
  },
  {
    sequelize,
    tableName: 'lexicon_questions',
    timestamps: true,
  }
);
