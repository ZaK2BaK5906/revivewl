import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// ============================================
// WL Scenario Answers Model
// ============================================

interface ScenarioAnswerAttributes {
  id: number;
  whitelist_id: number;
  scenario_id: number;
  answer: string;
  is_validated: boolean;
  score: number;
  admin_comment: string | null;
  created_at: Date;
}

interface ScenarioAnswerCreationAttributes extends Optional<ScenarioAnswerAttributes, 'id' | 'is_validated' | 'score' | 'admin_comment' | 'created_at'> {}

export class WlScenarioAnswer extends Model<ScenarioAnswerAttributes, ScenarioAnswerCreationAttributes> implements ScenarioAnswerAttributes {
  public id!: number;
  public whitelist_id!: number;
  public scenario_id!: number;
  public answer!: string;
  public is_validated!: boolean;
  public score!: number;
  public admin_comment!: string | null;
  public created_at!: Date;
}

WlScenarioAnswer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    whitelist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'whitelists',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    scenario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'scenarios',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_validated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    admin_comment: {
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
    tableName: 'wl_scenario_answers',
    timestamps: false,
  }
);

// ============================================
// WL Rule Answers Model
// ============================================

interface RuleAnswerAttributes {
  id: number;
  whitelist_id: number;
  question_id: number;
  answer: string;
  is_correct: boolean;
  score: number;
  created_at: Date;
}

interface RuleAnswerCreationAttributes extends Optional<RuleAnswerAttributes, 'id' | 'is_correct' | 'score' | 'created_at'> {}

export class WlRuleAnswer extends Model<RuleAnswerAttributes, RuleAnswerCreationAttributes> implements RuleAnswerAttributes {
  public id!: number;
  public whitelist_id!: number;
  public question_id!: number;
  public answer!: string;
  public is_correct!: boolean;
  public score!: number;
  public created_at!: Date;
}

WlRuleAnswer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    whitelist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'whitelists',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rule_questions',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'wl_rule_answers',
    timestamps: false,
  }
);

// ============================================
// WL Lexicon Answers Model
// ============================================

interface LexiconAnswerAttributes {
  id: number;
  whitelist_id: number;
  question_id: number;
  answer: string;
  is_correct: boolean;
  score: number;
  created_at: Date;
}

interface LexiconAnswerCreationAttributes extends Optional<LexiconAnswerAttributes, 'id' | 'is_correct' | 'score' | 'created_at'> {}

export class WlLexiconAnswer extends Model<LexiconAnswerAttributes, LexiconAnswerCreationAttributes> implements LexiconAnswerAttributes {
  public id!: number;
  public whitelist_id!: number;
  public question_id!: number;
  public answer!: string;
  public is_correct!: boolean;
  public score!: number;
  public created_at!: Date;
}

WlLexiconAnswer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    whitelist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'whitelists',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lexicon_questions',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'wl_lexicon_answers',
    timestamps: false,
  }
);

// ============================================
// WL Fixed Answers Model
// ============================================

type QuestionType = 'zone_safe' | 'password_hidden' | 'safe_word';

interface FixedAnswerAttributes {
  id: number;
  whitelist_id: number;
  question_type: QuestionType;
  answer: string;
  created_at: Date;
}

interface FixedAnswerCreationAttributes extends Optional<FixedAnswerAttributes, 'id' | 'created_at'> {}

export class WlFixedAnswer extends Model<FixedAnswerAttributes, FixedAnswerCreationAttributes> implements FixedAnswerAttributes {
  public id!: number;
  public whitelist_id!: number;
  public question_type!: QuestionType;
  public answer!: string;
  public created_at!: Date;
}

WlFixedAnswer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    whitelist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'whitelists',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    question_type: {
      type: DataTypes.ENUM('zone_safe', 'password_hidden', 'safe_word'),
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'wl_fixed_answers',
    timestamps: false,
  }
);
