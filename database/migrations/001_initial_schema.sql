-- =====================================================
-- FIVEM WHITELIST PANEL - BASE DE DONNÉES COMPLÈTE
-- =====================================================
-- Auteur: ZaK
-- Date: 2025-12-01
-- Description: Schéma complet pour le panel d'administration de whitelist FiveM RP
-- =====================================================

-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS fivem_whitelist
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fivem_whitelist;

-- =====================================================
-- TABLE: admins
-- Description: Gestion des comptes administrateurs
-- =====================================================
CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  permissions_json JSON DEFAULT NULL COMMENT 'Permissions granulaires en JSON',
  is_master BOOLEAN DEFAULT FALSE COMMENT 'Master admin flag',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Compte actif ou désactivé',
  two_fa_secret VARCHAR(255) DEFAULT NULL,
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  failed_login_attempts INT DEFAULT 0,
  last_failed_login DATETIME DEFAULT NULL,
  ip_blocked BOOLEAN DEFAULT FALSE,
  blocked_until DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INT UNSIGNED DEFAULT NULL COMMENT 'ID de l\'admin qui a créé ce compte',
  last_login DATETIME DEFAULT NULL,
  last_activity DATETIME DEFAULT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: refresh_tokens
-- Description: Gestion des tokens JWT refresh
-- =====================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id INT UNSIGNED NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,

  INDEX idx_admin_id (admin_id),
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: whitelists
-- Description: Données principales des whitelists
-- =====================================================
CREATE TABLE IF NOT EXISTS whitelists (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id INT UNSIGNED NOT NULL,
  candidat_nom VARCHAR(100) NOT NULL,
  candidat_prenom VARCHAR(100) NOT NULL,
  discord VARCHAR(100) NOT NULL COMMENT 'Pseudo Discord',
  age INT UNSIGNED NOT NULL,
  experience ENUM('débutant', 'intermédiaire', 'expérimenté') NOT NULL,
  categorie ENUM('legal', 'illégal', 'indépendant', 'organisation', 'gangs') NOT NULL,
  status ENUM('en_cours', 'validée', 'refusée', 'en_attente') DEFAULT 'en_cours',
  score_total DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Score total /100',
  score_scenarios DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Score des scénarios /30',
  score_reglement DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Score des questions règlement /70',
  duree_entretien_secondes INT UNSIGNED DEFAULT 0,
  date_debut DATETIME NOT NULL,
  date_fin DATETIME DEFAULT NULL,
  decision ENUM('accepté', 'refusé', 'en_attente') DEFAULT NULL,
  commentaire_decision TEXT DEFAULT NULL,
  raison_refus VARCHAR(255) DEFAULT NULL,
  refus_temporaire BOOLEAN DEFAULT FALSE,
  date_reexamen DATE DEFAULT NULL,
  notes_libres TEXT DEFAULT NULL COMMENT 'Notes de l\'admin pendant l\'entretien',
  flags JSON DEFAULT NULL COMMENT 'Flags: douteux, excellent, à surveiller',
  is_draft BOOLEAN DEFAULT FALSE COMMENT 'Brouillon non finalisé',
  draft_step INT DEFAULT 1 COMMENT 'Étape actuelle si brouillon',
  message_personnalise TEXT DEFAULT NULL COMMENT 'Message pour le candidat',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_admin_id (admin_id),
  INDEX idx_discord (discord),
  INDEX idx_status (status),
  INDEX idx_categorie (categorie),
  INDEX idx_date_debut (date_debut),
  INDEX idx_decision (decision),
  INDEX idx_is_draft (is_draft),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: scenarios
-- Description: Bibliothèque de scénarios RP
-- =====================================================
CREATE TABLE IF NOT EXISTS scenarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  contenu TEXT NOT NULL,
  categorie ENUM('legal', 'illégal', 'indépendant', 'organisation', 'gangs', 'universel') NOT NULL,
  tags JSON DEFAULT NULL COMMENT 'Tags pour catégorisation',
  created_by_admin_id INT UNSIGNED DEFAULT NULL,
  is_default BOOLEAN DEFAULT FALSE COMMENT 'Scénario par défaut du système',
  is_active BOOLEAN DEFAULT TRUE,
  votes_up INT UNSIGNED DEFAULT 0,
  votes_down INT UNSIGNED DEFAULT 0,
  utilisation_count INT UNSIGNED DEFAULT 0 COMMENT 'Nombre de fois utilisé',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_categorie (categorie),
  INDEX idx_is_active (is_active),
  INDEX idx_utilisation_count (utilisation_count),
  INDEX idx_created_by (created_by_admin_id),
  FULLTEXT idx_fulltext_contenu (titre, contenu),
  FOREIGN KEY (created_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: questions_reglement
-- Description: Bibliothèque de questions sur le règlement
-- =====================================================
CREATE TABLE IF NOT EXISTS questions_reglement (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  reponse_correcte TEXT NOT NULL COMMENT 'Réponse attendue',
  explication TEXT DEFAULT NULL COMMENT 'Explication de la règle',
  tags JSON DEFAULT NULL,
  created_by_admin_id INT UNSIGNED DEFAULT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  votes_up INT UNSIGNED DEFAULT 0,
  votes_down INT UNSIGNED DEFAULT 0,
  utilisation_count INT UNSIGNED DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_is_active (is_active),
  INDEX idx_utilisation_count (utilisation_count),
  INDEX idx_created_by (created_by_admin_id),
  FULLTEXT idx_fulltext_question (question, reponse_correcte),
  FOREIGN KEY (created_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: wl_scenarios
-- Description: Scénarios posés lors d'une WL spécifique
-- =====================================================
CREATE TABLE IF NOT EXISTS wl_scenarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  wl_id INT UNSIGNED NOT NULL,
  scenario_id INT UNSIGNED NOT NULL,
  reponse_candidat TEXT DEFAULT NULL,
  note DECIMAL(4,2) DEFAULT 0.00 COMMENT 'Note /10',
  order_index TINYINT UNSIGNED NOT NULL COMMENT 'Ordre du scénario (1, 2 ou 3)',
  duree_reponse_secondes INT UNSIGNED DEFAULT NULL COMMENT 'Temps de réponse',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_wl_id (wl_id),
  INDEX idx_scenario_id (scenario_id),
  INDEX idx_order (order_index),
  FOREIGN KEY (wl_id) REFERENCES whitelists(id) ON DELETE CASCADE,
  FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: wl_questions
-- Description: Questions posées lors d'une WL spécifique
-- =====================================================
CREATE TABLE IF NOT EXISTS wl_questions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  wl_id INT UNSIGNED NOT NULL,
  question_id INT UNSIGNED NOT NULL,
  reponse_candidat TEXT DEFAULT NULL,
  note DECIMAL(4,2) DEFAULT 0.00 COMMENT 'Note /10',
  bonne_reponse BOOLEAN DEFAULT FALSE COMMENT 'Quick check ✅/❌',
  order_index TINYINT UNSIGNED NOT NULL COMMENT 'Ordre de la question (1-7)',
  duree_reponse_secondes INT UNSIGNED DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_wl_id (wl_id),
  INDEX idx_question_id (question_id),
  INDEX idx_order (order_index),
  FOREIGN KEY (wl_id) REFERENCES whitelists(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions_reglement(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: commentaires_wl
-- Description: Commentaires entre admins sur une WL
-- =====================================================
CREATE TABLE IF NOT EXISTS commentaires_wl (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  wl_id INT UNSIGNED NOT NULL,
  admin_id INT UNSIGNED NOT NULL,
  commentaire TEXT NOT NULL,
  mentions JSON DEFAULT NULL COMMENT 'IDs des admins mentionnés avec @',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_wl_id (wl_id),
  INDEX idx_admin_id (admin_id),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (wl_id) REFERENCES whitelists(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: reclamations
-- Description: Réclamations des joueurs refusés
-- =====================================================
CREATE TABLE IF NOT EXISTS reclamations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  discord VARCHAR(100) NOT NULL,
  nom_rp VARCHAR(100) NOT NULL,
  prenom_rp VARCHAR(100) NOT NULL,
  raison TEXT NOT NULL,
  preuves JSON DEFAULT NULL COMMENT 'URLs des screenshots/preuves uploadés',
  status ENUM('en_attente', 'acceptée', 'refusée', 'traitée') DEFAULT 'en_attente',
  wl_id_original INT UNSIGNED DEFAULT NULL COMMENT 'Lien vers la WL refusée originale',
  reviewed_by_admin_id INT UNSIGNED DEFAULT NULL,
  reponse_admin TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME DEFAULT NULL,

  INDEX idx_discord (discord),
  INDEX idx_status (status),
  INDEX idx_wl_id_original (wl_id_original),
  INDEX idx_reviewed_by (reviewed_by_admin_id),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (wl_id_original) REFERENCES whitelists(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: logs
-- Description: Logs de toutes les actions importantes
-- =====================================================
CREATE TABLE IF NOT EXISTS logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id INT UNSIGNED DEFAULT NULL,
  action VARCHAR(100) NOT NULL COMMENT 'Type d\'action: login, create_wl, delete_admin, etc.',
  details_json JSON DEFAULT NULL COMMENT 'Détails de l\'action',
  ip VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_admin_id (admin_id),
  INDEX idx_action (action),
  INDEX idx_timestamp (timestamp),
  INDEX idx_ip (ip),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: notifications
-- Description: Centre de notifications pour les admins
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id INT UNSIGNED NOT NULL,
  type ENUM('reclamation', 'wl_attente', 'mention', 'update', 'message_master', 'autre') NOT NULL,
  titre VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  lien VARCHAR(500) DEFAULT NULL COMMENT 'URL vers la ressource concernée',
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_admin_id (admin_id),
  INDEX idx_is_read (is_read),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: messages
-- Description: Tchat interne entre admins
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_sender_id INT UNSIGNED NOT NULL,
  admin_receiver_id INT UNSIGNED DEFAULT NULL COMMENT 'NULL = message dans un salon public',
  salon VARCHAR(50) DEFAULT 'general' COMMENT 'Nom du salon (general, legal, illegal, etc.)',
  message TEXT NOT NULL,
  attachments JSON DEFAULT NULL COMMENT 'URLs des fichiers attachés',
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_sender (admin_sender_id),
  INDEX idx_receiver (admin_receiver_id),
  INDEX idx_salon (salon),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (admin_sender_id) REFERENCES admins(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_receiver_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: tickets
-- Description: Système de tickets support technique
-- =====================================================
CREATE TABLE IF NOT EXISTS tickets (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id INT UNSIGNED NOT NULL,
  type ENUM('bug', 'question', 'suggestion', 'autre') NOT NULL,
  sujet VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('ouvert', 'en_cours', 'résolu', 'fermé') DEFAULT 'ouvert',
  priority ENUM('basse', 'normale', 'haute', 'urgente') DEFAULT 'normale',
  assigned_to_admin_id INT UNSIGNED DEFAULT NULL COMMENT 'Admin qui traite le ticket',
  attachments JSON DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_admin_id (admin_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_assigned_to (assigned_to_admin_id),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: ticket_responses
-- Description: Réponses aux tickets
-- =====================================================
CREATE TABLE IF NOT EXISTS ticket_responses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT UNSIGNED NOT NULL,
  admin_id INT UNSIGNED NOT NULL,
  response TEXT NOT NULL,
  attachments JSON DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_ticket_id (ticket_id),
  INDEX idx_admin_id (admin_id),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: backups
-- Description: Historique des backups automatiques
-- =====================================================
CREATE TABLE IF NOT EXISTS backups (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(500) NOT NULL,
  size_mb DECIMAL(10,2) DEFAULT 0.00,
  status ENUM('succès', 'échec', 'en_cours') DEFAULT 'en_cours',
  error_message TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: admin_stats
-- Description: Statistiques pré-calculées par admin
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_stats (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id INT UNSIGNED NOT NULL UNIQUE,
  total_wl INT UNSIGNED DEFAULT 0,
  total_validees INT UNSIGNED DEFAULT 0,
  total_refusees INT UNSIGNED DEFAULT 0,
  total_en_attente INT UNSIGNED DEFAULT 0,
  temps_moyen_entretien_secondes INT UNSIGNED DEFAULT 0,
  score_moyen_wl DECIMAL(5,2) DEFAULT 0.00,
  taux_acceptation DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Pourcentage',
  niveau INT UNSIGNED DEFAULT 1 COMMENT 'Gamification',
  points INT UNSIGNED DEFAULT 0 COMMENT 'Gamification',
  badges JSON DEFAULT NULL COMMENT 'Liste des badges obtenus',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_admin_id (admin_id),
  INDEX idx_total_wl (total_wl),
  INDEX idx_niveau (niveau),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: scenario_votes
-- Description: Votes des admins sur les scénarios
-- =====================================================
CREATE TABLE IF NOT EXISTS scenario_votes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  scenario_id INT UNSIGNED NOT NULL,
  admin_id INT UNSIGNED NOT NULL,
  vote ENUM('up', 'down') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY unique_vote (scenario_id, admin_id),
  INDEX idx_scenario_id (scenario_id),
  INDEX idx_admin_id (admin_id),
  FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: question_votes
-- Description: Votes des admins sur les questions
-- =====================================================
CREATE TABLE IF NOT EXISTS question_votes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question_id INT UNSIGNED NOT NULL,
  admin_id INT UNSIGNED NOT NULL,
  vote ENUM('up', 'down') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY unique_vote (question_id, admin_id),
  INDEX idx_question_id (question_id),
  INDEX idx_admin_id (admin_id),
  FOREIGN KEY (question_id) REFERENCES questions_reglement(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: settings
-- Description: Paramètres globaux du panel
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  updated_by_admin_id INT UNSIGNED DEFAULT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_key (setting_key),
  FOREIGN KEY (updated_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: changelog
-- Description: Historique des mises à jour du panel
-- =====================================================
CREATE TABLE IF NOT EXISTS changelog (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  version VARCHAR(20) NOT NULL,
  titre VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  type ENUM('feature', 'bugfix', 'improvement', 'security') NOT NULL,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_published_at (published_at),
  INDEX idx_version (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: api_keys
-- Description: Clés API pour accès externe (optionnel)
-- =====================================================
CREATE TABLE IF NOT EXISTS api_keys (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  permissions JSON DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  rate_limit INT UNSIGNED DEFAULT 100 COMMENT 'Requêtes par heure',
  last_used_at DATETIME DEFAULT NULL,
  created_by_admin_id INT UNSIGNED DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME DEFAULT NULL,

  INDEX idx_key_hash (key_hash),
  INDEX idx_is_active (is_active),
  FOREIGN KEY (created_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: formation_modules
-- Description: Modules de formation pour nouveaux admins
-- =====================================================
CREATE TABLE IF NOT EXISTS formation_modules (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  contenu TEXT NOT NULL COMMENT 'Contenu du module (markdown)',
  video_url VARCHAR(500) DEFAULT NULL,
  order_index INT UNSIGNED NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_order (order_index),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: formation_quiz
-- Description: Quiz de validation de formation
-- =====================================================
CREATE TABLE IF NOT EXISTS formation_quiz (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  module_id INT UNSIGNED NOT NULL,
  question TEXT NOT NULL,
  reponses JSON NOT NULL COMMENT 'Liste des réponses possibles',
  reponse_correcte_index INT UNSIGNED NOT NULL,
  explication TEXT DEFAULT NULL,
  order_index INT UNSIGNED NOT NULL,

  INDEX idx_module_id (module_id),
  INDEX idx_order (order_index),
  FOREIGN KEY (module_id) REFERENCES formation_modules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: formation_progress
-- Description: Progression des admins dans la formation
-- =====================================================
CREATE TABLE IF NOT EXISTS formation_progress (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id INT UNSIGNED NOT NULL,
  module_id INT UNSIGNED NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  quiz_score DECIMAL(5,2) DEFAULT NULL COMMENT 'Score en %',
  quiz_attempts INT UNSIGNED DEFAULT 0,
  completed_at DATETIME DEFAULT NULL,

  UNIQUE KEY unique_progress (admin_id, module_id),
  INDEX idx_admin_id (admin_id),
  INDEX idx_module_id (module_id),
  INDEX idx_completed (completed),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES formation_modules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: wl_history
-- Description: Historique des modifications sur les WL
-- =====================================================
CREATE TABLE IF NOT EXISTS wl_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  wl_id INT UNSIGNED NOT NULL,
  admin_id INT UNSIGNED NOT NULL,
  action VARCHAR(100) NOT NULL COMMENT 'created, updated, status_changed, reopened, etc.',
  changes_json JSON DEFAULT NULL COMMENT 'Détails des modifications',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_wl_id (wl_id),
  INDEX idx_admin_id (admin_id),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (wl_id) REFERENCES whitelists(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- VUE: admin_leaderboard
-- Description: Classement des admins par activité
-- =====================================================
CREATE OR REPLACE VIEW admin_leaderboard AS
SELECT
  a.id,
  a.username,
  a.avatar,
  s.total_wl,
  s.total_validees,
  s.total_refusees,
  s.taux_acceptation,
  s.temps_moyen_entretien_secondes,
  s.niveau,
  s.points,
  s.badges
FROM admins a
LEFT JOIN admin_stats s ON a.id = s.admin_id
WHERE a.is_active = TRUE
ORDER BY s.points DESC, s.total_wl DESC;

-- =====================================================
-- VUE: wl_statistics_daily
-- Description: Statistiques journalières des WL
-- =====================================================
CREATE OR REPLACE VIEW wl_statistics_daily AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as total,
  SUM(CASE WHEN decision = 'accepté' THEN 1 ELSE 0 END) as validees,
  SUM(CASE WHEN decision = 'refusé' THEN 1 ELSE 0 END) as refusees,
  SUM(CASE WHEN decision = 'en_attente' THEN 1 ELSE 0 END) as en_attente,
  AVG(score_total) as score_moyen,
  AVG(duree_entretien_secondes) as duree_moyenne
FROM whitelists
WHERE status != 'en_cours' AND is_draft = FALSE
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- =====================================================
-- TRIGGER: update_scenario_usage_count
-- Description: Incrémente le compteur d'utilisation d'un scénario
-- =====================================================
DELIMITER $$
CREATE TRIGGER update_scenario_usage_count
AFTER INSERT ON wl_scenarios
FOR EACH ROW
BEGIN
  UPDATE scenarios
  SET utilisation_count = utilisation_count + 1
  WHERE id = NEW.scenario_id;
END$$
DELIMITER ;

-- =====================================================
-- TRIGGER: update_question_usage_count
-- Description: Incrémente le compteur d'utilisation d'une question
-- =====================================================
DELIMITER $$
CREATE TRIGGER update_question_usage_count
AFTER INSERT ON wl_questions
FOR EACH ROW
BEGIN
  UPDATE questions_reglement
  SET utilisation_count = utilisation_count + 1
  WHERE id = NEW.question_id;
END$$
DELIMITER ;

-- =====================================================
-- TRIGGER: log_wl_status_change
-- Description: Log automatique lors du changement de statut d'une WL
-- =====================================================
DELIMITER $$
CREATE TRIGGER log_wl_status_change
AFTER UPDATE ON whitelists
FOR EACH ROW
BEGIN
  IF OLD.status != NEW.status OR OLD.decision != NEW.decision THEN
    INSERT INTO wl_history (wl_id, admin_id, action, changes_json)
    VALUES (
      NEW.id,
      NEW.admin_id,
      'status_changed',
      JSON_OBJECT(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'old_decision', OLD.decision,
        'new_decision', NEW.decision
      )
    );
  END IF;
END$$
DELIMITER ;

-- =====================================================
-- PROCÉDURE: update_admin_statistics
-- Description: Recalcule les statistiques d'un admin
-- =====================================================
DELIMITER $$
CREATE PROCEDURE update_admin_statistics(IN p_admin_id INT)
BEGIN
  INSERT INTO admin_stats (
    admin_id,
    total_wl,
    total_validees,
    total_refusees,
    total_en_attente,
    temps_moyen_entretien_secondes,
    score_moyen_wl,
    taux_acceptation
  )
  SELECT
    p_admin_id,
    COUNT(*) as total_wl,
    SUM(CASE WHEN decision = 'accepté' THEN 1 ELSE 0 END) as total_validees,
    SUM(CASE WHEN decision = 'refusé' THEN 1 ELSE 0 END) as total_refusees,
    SUM(CASE WHEN decision = 'en_attente' THEN 1 ELSE 0 END) as total_en_attente,
    AVG(duree_entretien_secondes) as temps_moyen_entretien_secondes,
    AVG(score_total) as score_moyen_wl,
    ROUND(
      (SUM(CASE WHEN decision = 'accepté' THEN 1 ELSE 0 END) / COUNT(*)) * 100,
      2
    ) as taux_acceptation
  FROM whitelists
  WHERE admin_id = p_admin_id AND status != 'en_cours' AND is_draft = FALSE
  ON DUPLICATE KEY UPDATE
    total_wl = VALUES(total_wl),
    total_validees = VALUES(total_validees),
    total_refusees = VALUES(total_refusees),
    total_en_attente = VALUES(total_en_attente),
    temps_moyen_entretien_secondes = VALUES(temps_moyen_entretien_secondes),
    score_moyen_wl = VALUES(score_moyen_wl),
    taux_acceptation = VALUES(taux_acceptation);
END$$
DELIMITER ;

-- =====================================================
-- PROCÉDURE: cleanup_old_data
-- Description: Nettoie les données anciennes (maintenance)
-- =====================================================
DELIMITER $$
CREATE PROCEDURE cleanup_old_data()
BEGIN
  -- Supprimer les tokens expirés
  DELETE FROM refresh_tokens WHERE expires_at < NOW();

  -- Supprimer les notifications lues de plus de 30 jours
  DELETE FROM notifications
  WHERE is_read = TRUE AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

  -- Supprimer les logs de plus de 90 jours
  DELETE FROM logs
  WHERE timestamp < DATE_SUB(NOW(), INTERVAL 90 DAY);

  -- Supprimer les anciens backups (garder les 30 derniers)
  DELETE FROM backups
  WHERE id NOT IN (
    SELECT id FROM (
      SELECT id FROM backups ORDER BY created_at DESC LIMIT 30
    ) AS tmp
  );
END$$
DELIMITER ;

-- =====================================================
-- Index composites pour optimisation des requêtes
-- =====================================================
CREATE INDEX idx_wl_admin_status ON whitelists(admin_id, status);
CREATE INDEX idx_wl_categorie_decision ON whitelists(categorie, decision);
CREATE INDEX idx_wl_date_status ON whitelists(date_debut, status);
CREATE INDEX idx_logs_admin_action ON logs(admin_id, action);
CREATE INDEX idx_notifications_admin_read ON notifications(admin_id, is_read);

-- =====================================================
-- FIN DU SCHEMA
-- =====================================================
