export const PERMISSIONS = {
  VIEW_ALL_WL: 'can_view_all_wl',
  VIEW_OWN_WL: 'can_view_own_wl',
  CREATE_WL: 'can_create_wl',
  VALIDATE_WL: 'can_validate_wl',
  REFUSE_WL: 'can_refuse_wl',
  PENDING_WL: 'can_pending_wl',
  MODIFY_WL: 'can_modify_wl',
  DELETE_WL: 'can_delete_wl',
  MANAGE_TEMPLATES: 'can_manage_templates',
  VIEW_STATISTICS: 'can_view_statistics',
  MANAGE_CLAIMS: 'can_manage_claims',
  ACCESS_CHAT: 'can_access_chat',
  CREATE_TICKETS: 'can_create_tickets',
  MANAGE_ADMINS: 'can_manage_admins',
} as const;

export const WL_STATUS = {
  IN_PROGRESS: 'en_cours',
  VALIDATED: 'validée',
  REFUSED: 'refusée',
  PENDING: 'en_attente',
} as const;

export const EXPERIENCE_LEVELS = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  EXPERIENCED: 'Expérimenté',
} as const;

export const TICKET_STATUS = {
  OPEN: 'Ouvert',
  IN_PROGRESS: 'En cours',
  RESOLVED: 'Résolu',
  CLOSED: 'Fermé',
} as const;

export const TICKET_TYPES = {
  BUG: 'Bug',
  QUESTION: 'Question',
  SUGGESTION: 'Suggestion',
  OTHER: 'Autre',
} as const;

export const WEBHOOK_EVENTS = {
  INTERVIEW_STARTED: 'interview_started',
  WL_VALIDATED: 'wl_validated',
  WL_REFUSED: 'wl_refused',
  WL_PENDING: 'wl_pending',
  ADMIN_CREATED: 'admin_created',
  ADMIN_MODIFIED: 'admin_modified',
  SECURITY_ALERT: 'security_alert',
  DAILY_REPORT: 'daily_report',
  REMINDER_48H: 'reminder_48h',
  BACKUP_COMPLETED: 'backup_completed',
} as const;

export const DISCORD_COLORS = {
  BLUE: 0x3b82f6,
  GREEN: 0x10b981,
  RED: 0xef4444,
  ORANGE: 0xf97316,
  PURPLE: 0xa855f7,
  YELLOW: 0xeab308,
  DARK_GREEN: 0x047857,
  DARK_RED: 0x991b1b,
  LIGHT_BLUE: 0x60a5fa,
} as const;

export const SCORING = {
  TOTAL: 100,
  SCENARIOS: 30,
  QUESTIONS: 70,
  SCENARIO_EACH: 10,
  RULE_EACH: 5,
  LEXICON_EACH: 5,
  FIXED_EACH: 5,
} as const;

export const QUESTION_TYPES = {
  ZONE_SAFE: 'zone_safe',
  PASSWORD_HIDDEN: 'password_hidden',
  SAFE_WORD: 'safe_word',
} as const;

export const FIXED_QUESTIONS = [
  {
    type: QUESTION_TYPES.ZONE_SAFE,
    question: 'Qu\'est-ce qu\'une zone safe ?',
    expectedAnswer: 'Une zone où le RP violent est interdit',
  },
  {
    type: QUESTION_TYPES.PASSWORD_HIDDEN,
    question: 'Quel est le mot de passe caché dans le règlement ?',
    expectedAnswer: '', // To be configured by admin
  },
  {
    type: QUESTION_TYPES.SAFE_WORD,
    question: 'Quel est le safe word du serveur ?',
    expectedAnswer: '', // To be configured by admin
  },
] as const;
