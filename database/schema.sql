-- ============================================
-- REVIVE RP - WHITELIST PANEL DATABASE SCHEMA
-- ============================================

-- Table des administrateurs
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `is_master` BOOLEAN DEFAULT FALSE,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `two_fa_secret` VARCHAR(100) DEFAULT NULL,
  `two_fa_enabled` BOOLEAN DEFAULT FALSE,
  `is_active` BOOLEAN DEFAULT TRUE,
  `last_login` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT DEFAULT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `admins`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des permissions
CREATE TABLE `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT NOT NULL,
  `can_view_all_wl` BOOLEAN DEFAULT FALSE,
  `can_view_own_wl` BOOLEAN DEFAULT TRUE,
  `can_create_wl` BOOLEAN DEFAULT FALSE,
  `can_validate_wl` BOOLEAN DEFAULT FALSE,
  `can_refuse_wl` BOOLEAN DEFAULT FALSE,
  `can_pending_wl` BOOLEAN DEFAULT FALSE,
  `can_modify_wl` BOOLEAN DEFAULT FALSE,
  `can_delete_wl` BOOLEAN DEFAULT FALSE,
  `can_manage_templates` BOOLEAN DEFAULT FALSE,
  `can_view_statistics` BOOLEAN DEFAULT FALSE,
  `can_manage_claims` BOOLEAN DEFAULT FALSE,
  `can_access_chat` BOOLEAN DEFAULT FALSE,
  `can_create_tickets` BOOLEAN DEFAULT FALSE,
  `can_manage_admins` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des catégories de whitelist
CREATE TABLE `wl_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `color` VARCHAR(7) DEFAULT '#3B82F6',
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default categories
INSERT INTO `wl_categories` (`name`, `description`, `color`) VALUES
('Legal', 'Métiers légaux', '#10B981'),
('Illégal', 'Métiers illégaux', '#EF4444');

-- Table des scénarios
CREATE TABLE `scenarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `expected_answer` TEXT,
  `points` INT DEFAULT 10,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `wl_categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des questions de règlement
CREATE TABLE `rule_questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `question` TEXT NOT NULL,
  `correct_answer` TEXT NOT NULL,
  `category_id` INT DEFAULT NULL,
  `points` INT DEFAULT 5,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `wl_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des questions de lexique
CREATE TABLE `lexicon_questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `question` TEXT NOT NULL,
  `correct_answer` TEXT NOT NULL,
  `category_id` INT DEFAULT NULL,
  `points` INT DEFAULT 5,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `wl_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des whitelists
CREATE TABLE `whitelists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `candidate_firstname` VARCHAR(100) NOT NULL,
  `candidate_lastname` VARCHAR(100) NOT NULL,
  `discord_username` VARCHAR(100) NOT NULL,
  `age` INT NOT NULL,
  `experience_level` ENUM('Débutant', 'Intermédiaire', 'Expérimenté') NOT NULL,
  `rp_hours` INT DEFAULT 0,
  `category_id` INT NOT NULL,
  `admin_id` INT NOT NULL,
  `status` ENUM('en_cours', 'validée', 'refusée', 'en_attente') DEFAULT 'en_cours',
  `total_score` DECIMAL(5,2) DEFAULT 0,
  `scenario_score` DECIMAL(5,2) DEFAULT 0,
  `questions_score` DECIMAL(5,2) DEFAULT 0,
  `auto_suggestion` ENUM('accepter', 'refuser', 'en_attente') DEFAULT NULL,
  `final_decision` ENUM('validée', 'refusée', 'en_attente') DEFAULT NULL,
  `validation_comment` TEXT,
  `refusal_reason` TEXT,
  `pending_reason` TEXT,
  `reexam_date` DATE DEFAULT NULL,
  `is_temporary_refusal` BOOLEAN DEFAULT FALSE,
  `interview_start` DATETIME DEFAULT NULL,
  `interview_end` DATETIME DEFAULT NULL,
  `interview_duration` INT DEFAULT 0,
  `admin_notes` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `wl_categories`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE,
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_admin` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des réponses aux scénarios
CREATE TABLE `wl_scenario_answers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `whitelist_id` INT NOT NULL,
  `scenario_id` INT NOT NULL,
  `candidate_answer` TEXT,
  `is_validated` BOOLEAN DEFAULT FALSE,
  `score` DECIMAL(5,2) DEFAULT 0,
  `admin_comment` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`whitelist_id`) REFERENCES `whitelists`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des réponses aux questions de règlement
CREATE TABLE `wl_rule_answers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `whitelist_id` INT NOT NULL,
  `question_id` INT NOT NULL,
  `candidate_answer` TEXT,
  `is_correct` BOOLEAN DEFAULT FALSE,
  `score` DECIMAL(5,2) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`whitelist_id`) REFERENCES `whitelists`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`question_id`) REFERENCES `rule_questions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des réponses aux questions de lexique
CREATE TABLE `wl_lexicon_answers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `whitelist_id` INT NOT NULL,
  `question_id` INT NOT NULL,
  `candidate_answer` TEXT,
  `is_correct` BOOLEAN DEFAULT FALSE,
  `score` DECIMAL(5,2) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`whitelist_id`) REFERENCES `whitelists`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`question_id`) REFERENCES `lexicon_questions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des questions fixes (zone safe, mot de passe, safe word)
CREATE TABLE `wl_fixed_answers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `whitelist_id` INT NOT NULL,
  `question_type` ENUM('zone_safe', 'password_hidden', 'safe_word') NOT NULL,
  `candidate_answer` TEXT,
  `is_correct` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`whitelist_id`) REFERENCES `whitelists`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table de l'historique des modifications de WL
CREATE TABLE `wl_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `whitelist_id` INT NOT NULL,
  `admin_id` INT NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `old_value` TEXT,
  `new_value` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`whitelist_id`) REFERENCES `whitelists`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des webhooks Discord
CREATE TABLE `discord_webhooks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `webhook_url` VARCHAR(500) NOT NULL,
  `event_type` ENUM('interview_started', 'wl_validated', 'wl_refused', 'wl_pending', 'admin_created', 'admin_modified', 'security_alert', 'daily_report', 'reminder_48h', 'backup_completed') NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des logs de webhook
CREATE TABLE `webhook_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `webhook_id` INT NOT NULL,
  `payload` TEXT,
  `response_status` INT,
  `response_body` TEXT,
  `sent_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`webhook_id`) REFERENCES `discord_webhooks`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table du chat interne
CREATE TABLE `chat_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT NOT NULL,
  `room` VARCHAR(50) DEFAULT 'general',
  `message` TEXT NOT NULL,
  `attachments` TEXT,
  `is_edited` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE,
  INDEX `idx_room` (`room`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des tickets support
CREATE TABLE `tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `type` ENUM('Bug', 'Question', 'Suggestion', 'Autre') NOT NULL,
  `status` ENUM('Ouvert', 'En cours', 'Résolu', 'Fermé') DEFAULT 'Ouvert',
  `priority` ENUM('Basse', 'Normale', 'Haute', 'Urgente') DEFAULT 'Normale',
  `created_by` INT NOT NULL,
  `assigned_to` INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resolved_at` DATETIME DEFAULT NULL,
  FOREIGN KEY (`created_by`) REFERENCES `admins`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_to`) REFERENCES `admins`(`id`) ON DELETE SET NULL,
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des commentaires de tickets
CREATE TABLE `ticket_comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_id` INT NOT NULL,
  `admin_id` INT NOT NULL,
  `comment` TEXT NOT NULL,
  `attachments` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des backups
CREATE TABLE `backups` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `file_size` BIGINT,
  `backup_type` ENUM('automatic', 'manual') DEFAULT 'automatic',
  `status` ENUM('success', 'failed') DEFAULT 'success',
  `error_message` TEXT,
  `created_by` INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `admins`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des règlements du serveur
CREATE TABLE `server_rules` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `section_title` VARCHAR(255) NOT NULL,
  `section_order` INT DEFAULT 0,
  `content` TEXT NOT NULL,
  `is_visible` BOOLEAN DEFAULT TRUE,
  `created_by` INT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `admins`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table du mode maintenance
CREATE TABLE `maintenance_mode` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `is_enabled` BOOLEAN DEFAULT FALSE,
  `title` VARCHAR(255) DEFAULT 'Maintenance en cours',
  `message` TEXT,
  `image_url` VARCHAR(500),
  `estimated_end` DATETIME DEFAULT NULL,
  `enabled_by` INT DEFAULT NULL,
  `enabled_at` DATETIME DEFAULT NULL,
  `disabled_at` DATETIME DEFAULT NULL,
  FOREIGN KEY (`enabled_by`) REFERENCES `admins`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default maintenance record
INSERT INTO `maintenance_mode` (`is_enabled`) VALUES (FALSE);

-- Table du changelog
CREATE TABLE `changelog` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `version` VARCHAR(20) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `release_date` DATE NOT NULL,
  `category` ENUM('feature', 'bugfix', 'improvement', 'security') DEFAULT 'feature',
  `is_published` BOOLEAN DEFAULT FALSE,
  `created_by` INT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `admins`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des logs de sécurité
CREATE TABLE `security_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT DEFAULT NULL,
  `username_attempt` VARCHAR(100),
  `ip_address` VARCHAR(45),
  `action` VARCHAR(100) NOT NULL,
  `status` ENUM('success', 'failed') NOT NULL,
  `user_agent` VARCHAR(500),
  `details` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE SET NULL,
  INDEX `idx_ip` (`ip_address`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des sessions
CREATE TABLE `sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT NOT NULL,
  `token` VARCHAR(500) NOT NULL,
  `ip_address` VARCHAR(45),
  `user_agent` VARCHAR(500),
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE,
  INDEX `idx_token` (`token`(255)),
  INDEX `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des statistiques quotidiennes (pour optimiser les requêtes)
CREATE TABLE `daily_stats` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `date` DATE NOT NULL UNIQUE,
  `wl_validated` INT DEFAULT 0,
  `wl_refused` INT DEFAULT 0,
  `wl_pending` INT DEFAULT 0,
  `total_interviews` INT DEFAULT 0,
  `avg_interview_duration` DECIMAL(10,2) DEFAULT 0,
  `avg_score` DECIMAL(5,2) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des notifications
CREATE TABLE `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  `is_read` BOOLEAN DEFAULT FALSE,
  `link` VARCHAR(500),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE,
  INDEX `idx_admin_read` (`admin_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VIEWS POUR FACILITER LES REQUÊTES
-- ============================================

-- Vue des statistiques admin
CREATE VIEW `admin_stats` AS
SELECT
  a.id,
  a.username,
  COUNT(DISTINCT w.id) as total_interviews,
  SUM(CASE WHEN w.status = 'validée' THEN 1 ELSE 0 END) as validated_count,
  SUM(CASE WHEN w.status = 'refusée' THEN 1 ELSE 0 END) as refused_count,
  SUM(CASE WHEN w.status = 'en_attente' THEN 1 ELSE 0 END) as pending_count,
  ROUND(AVG(w.total_score), 2) as avg_score,
  ROUND(AVG(w.interview_duration), 2) as avg_duration
FROM admins a
LEFT JOIN whitelists w ON a.id = w.admin_id
GROUP BY a.id, a.username;

-- Vue des WL récentes
CREATE VIEW `recent_whitelists` AS
SELECT
  w.*,
  CONCAT(w.candidate_firstname, ' ', w.candidate_lastname) as full_name,
  a.username as admin_name,
  c.name as category_name,
  c.color as category_color
FROM whitelists w
JOIN admins a ON w.admin_id = a.id
JOIN wl_categories c ON w.category_id = c.id
ORDER BY w.created_at DESC;
