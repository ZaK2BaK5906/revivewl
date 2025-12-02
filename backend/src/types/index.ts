// =====================================================
// TYPES GLOBAUX - TypeScript
// =====================================================

import { Request } from 'express';

// =====================================================
// Types Admins
// =====================================================
export interface Admin {
  id: number;
  username: string;
  password_hash: string;
  email: string;
  avatar: string | null;
  permissions_json: AdminPermissions | null;
  is_master: boolean;
  is_active: boolean;
  two_fa_secret: string | null;
  two_fa_enabled: boolean;
  failed_login_attempts: number;
  last_failed_login: Date | null;
  ip_blocked: boolean;
  blocked_until: Date | null;
  created_at: Date;
  created_by: number | null;
  last_login: Date | null;
  last_activity: Date | null;
  updated_at: Date;
}

export interface AdminPermissions {
  voir_toutes_wl: boolean;
  voir_propres_wl: boolean;
  creer_wl: boolean;
  valider_wl: boolean;
  refuser_wl: boolean;
  mettre_en_attente: boolean;
  modifier_wl: boolean;
  supprimer_wl: boolean;
  gerer_templates: boolean;
  acces_statistiques: boolean;
  gerer_reclamations: boolean;
  acces_tchat: boolean;
  creer_tickets: boolean;
  gerer_admins: boolean;
}

export interface AdminSafeData {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  permissions_json: AdminPermissions | null;
  is_master: boolean;
  is_active: boolean;
  two_fa_enabled: boolean;
  created_at: Date;
  last_login: Date | null;
}

export interface AdminStats {
  id: number;
  admin_id: number;
  total_wl: number;
  total_validees: number;
  total_refusees: number;
  total_en_attente: number;
  temps_moyen_entretien_secondes: number;
  score_moyen_wl: number;
  taux_acceptation: number;
  niveau: number;
  points: number;
  badges: string[] | null;
  updated_at: Date;
}

// =====================================================
// Types Whitelists
// =====================================================
export type WLStatus = 'en_cours' | 'validée' | 'refusée' | 'en_attente';
export type WLDecision = 'accepté' | 'refusé' | 'en_attente';
export type WLCategorie = 'legal' | 'illégal' | 'indépendant' | 'organisation' | 'gangs';
export type WLExperience = 'débutant' | 'intermédiaire' | 'expérimenté';

export interface Whitelist {
  id: number;
  admin_id: number;
  candidat_nom: string;
  candidat_prenom: string;
  discord: string;
  age: number;
  experience: WLExperience;
  categorie: WLCategorie;
  status: WLStatus;
  score_total: number;
  score_scenarios: number;
  score_reglement: number;
  duree_entretien_secondes: number;
  date_debut: Date;
  date_fin: Date | null;
  decision: WLDecision | null;
  commentaire_decision: string | null;
  raison_refus: string | null;
  refus_temporaire: boolean;
  date_reexamen: Date | null;
  notes_libres: string | null;
  flags: WLFlag[] | null;
  is_draft: boolean;
  draft_step: number;
  message_personnalise: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface WLFlag {
  type: 'douteux' | 'excellent' | 'à_surveiller';
  note: string;
  timestamp: Date;
}

export interface WLScenario {
  id: number;
  wl_id: number;
  scenario_id: number;
  reponse_candidat: string | null;
  note: number;
  order_index: number;
  duree_reponse_secondes: number | null;
  created_at: Date;
}

export interface WLQuestion {
  id: number;
  wl_id: number;
  question_id: number;
  reponse_candidat: string | null;
  note: number;
  bonne_reponse: boolean;
  order_index: number;
  duree_reponse_secondes: number | null;
  created_at: Date;
}

export interface WhitelistComplete extends Whitelist {
  scenarios: (WLScenario & { scenario: Scenario })[];
  questions: (WLQuestion & { question: QuestionReglement })[];
  admin: AdminSafeData;
  commentaires?: CommentaireWL[];
}

// =====================================================
// Types Scénarios et Questions
// =====================================================
export interface Scenario {
  id: number;
  titre: string;
  contenu: string;
  categorie: WLCategorie | 'universel';
  tags: string[] | null;
  created_by_admin_id: number | null;
  is_default: boolean;
  is_active: boolean;
  votes_up: number;
  votes_down: number;
  utilisation_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface QuestionReglement {
  id: number;
  question: string;
  reponse_correcte: string;
  explication: string | null;
  tags: string[] | null;
  created_by_admin_id: number | null;
  is_default: boolean;
  is_active: boolean;
  votes_up: number;
  votes_down: number;
  utilisation_count: number;
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// Types Notifications & Messages
// =====================================================
export type NotificationType = 'reclamation' | 'wl_attente' | 'mention' | 'update' | 'message_master' | 'autre';

export interface Notification {
  id: number;
  admin_id: number;
  type: NotificationType;
  titre: string;
  message: string;
  lien: string | null;
  is_read: boolean;
  created_at: Date;
}

export interface Message {
  id: number;
  admin_sender_id: number;
  admin_receiver_id: number | null;
  salon: string;
  message: string;
  attachments: string[] | null;
  is_read: boolean;
  created_at: Date;
}

// =====================================================
// Types Réclamations & Tickets
// =====================================================
export type ReclamationStatus = 'en_attente' | 'acceptée' | 'refusée' | 'traitée';

export interface Reclamation {
  id: number;
  discord: string;
  nom_rp: string;
  prenom_rp: string;
  raison: string;
  preuves: string[] | null;
  status: ReclamationStatus;
  wl_id_original: number | null;
  reviewed_by_admin_id: number | null;
  reponse_admin: string | null;
  created_at: Date;
  reviewed_at: Date | null;
}

export type TicketType = 'bug' | 'question' | 'suggestion' | 'autre';
export type TicketStatus = 'ouvert' | 'en_cours' | 'résolu' | 'fermé';
export type TicketPriority = 'basse' | 'normale' | 'haute' | 'urgente';

export interface Ticket {
  id: number;
  admin_id: number;
  type: TicketType;
  sujet: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned_to_admin_id: number | null;
  attachments: string[] | null;
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// Types Formation
// =====================================================
export interface FormationModule {
  id: number;
  titre: string;
  description: string;
  contenu: string;
  video_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface FormationQuiz {
  id: number;
  module_id: number;
  question: string;
  reponses: string[];
  reponse_correcte_index: number;
  explication: string | null;
  order_index: number;
}

export interface FormationProgress {
  id: number;
  admin_id: number;
  module_id: number;
  completed: boolean;
  quiz_score: number | null;
  quiz_attempts: number;
  completed_at: Date | null;
}

// =====================================================
// Types Logs & Backups
// =====================================================
export interface Log {
  id: number;
  admin_id: number | null;
  action: string;
  details_json: Record<string, any> | null;
  ip: string | null;
  user_agent: string | null;
  timestamp: Date;
}

export interface Backup {
  id: number;
  filename: string;
  filepath: string;
  size_mb: number;
  status: 'succès' | 'échec' | 'en_cours';
  error_message: string | null;
  created_at: Date;
}

// =====================================================
// Types Commentaires
// =====================================================
export interface CommentaireWL {
  id: number;
  wl_id: number;
  admin_id: number;
  commentaire: string;
  mentions: number[] | null;
  created_at: Date;
  updated_at: Date;
  admin?: AdminSafeData;
}

// =====================================================
// Types API Request/Response
// =====================================================
export interface AuthRequest extends Request {
  admin?: AdminSafeData;
  adminId?: number;
}

export interface LoginRequestBody {
  username: string;
  password: string;
  two_fa_token?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    admin: AdminSafeData;
    token: string;
    refreshToken: string;
    require2FA?: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// =====================================================
// Types Statistics
// =====================================================
export interface DashboardStats {
  today: {
    total_wl: number;
    validees: number;
    refusees: number;
    en_attente: number;
    taux_reussite: number;
  };
  week: {
    total_wl: number;
    validees: number;
    refusees: number;
    en_attente: number;
    taux_reussite: number;
  };
  month: {
    total_wl: number;
    validees: number;
    refusees: number;
    en_attente: number;
    taux_reussite: number;
  };
  temps_moyen_traitement: number;
  top_admins: Array<{
    admin: AdminSafeData;
    stats: AdminStats;
  }>;
  repartition_categories: Record<WLCategorie, number>;
  evolution_30j: Array<{
    date: string;
    total: number;
    validees: number;
    refusees: number;
  }>;
}

// =====================================================
// Types Discord Webhooks
// =====================================================
export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
  thumbnail?: {
    url: string;
  };
  author?: {
    name: string;
    icon_url?: string;
  };
}

export interface DiscordWebhookPayload {
  content?: string;
  embeds?: DiscordEmbed[];
  username?: string;
  avatar_url?: string;
}

// =====================================================
// Types Settings
// =====================================================
export interface Setting {
  id: number;
  setting_key: string;
  setting_value: string;
  description: string | null;
  updated_by_admin_id: number | null;
  updated_at: Date;
}

export interface AppSettings {
  maintenance_mode: boolean;
  maintenance_message: string;
  wl_score_minimum: number;
  wl_nb_scenarios: number;
  wl_nb_questions: number;
  backup_enabled: boolean;
  daily_report_enabled: boolean;
  registration_enabled: boolean;
  server_name: string;
  server_logo_url: string;
  timezone: string;
}

// =====================================================
// Types Changelog
// =====================================================
export type ChangelogType = 'feature' | 'bugfix' | 'improvement' | 'security';

export interface Changelog {
  id: number;
  version: string;
  titre: string;
  description: string;
  type: ChangelogType;
  published_at: Date;
}

// =====================================================
// Types JWT
// =====================================================
export interface JWTPayload {
  adminId: number;
  username: string;
  is_master: boolean;
  iat?: number;
  exp?: number;
}

export interface RefreshToken {
  id: number;
  admin_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
  ip_address: string | null;
  user_agent: string | null;
}
