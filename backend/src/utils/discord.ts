// =====================================================
// UTILITAIRES DISCORD - Webhooks
// =====================================================

import axios from 'axios';
import { DiscordWebhookPayload, DiscordEmbed, Whitelist, AdminSafeData } from '../types';
import { logWebhook } from './logger';
import logger from './logger';

// =====================================================
// URLs des webhooks (depuis .env)
// =====================================================
const WEBHOOKS = {
  WL_VALIDEE: process.env.DISCORD_WEBHOOK_WL_VALIDEE || '',
  WL_REFUSEE: process.env.DISCORD_WEBHOOK_WL_REFUSEE || '',
  WL_ATTENTE: process.env.DISCORD_WEBHOOK_WL_ATTENTE || '',
  ENTRETIEN: process.env.DISCORD_WEBHOOK_ENTRETIEN || '',
  ADMIN: process.env.DISCORD_WEBHOOK_ADMIN || '',
  SECURITY: process.env.DISCORD_WEBHOOK_SECURITY || '',
  BACKUP: process.env.DISCORD_WEBHOOK_BACKUP || '',
  DAILY_REPORT: process.env.DISCORD_WEBHOOK_DAILY_REPORT || '',
  RAPPEL: process.env.DISCORD_WEBHOOK_RAPPEL || '',
};

// =====================================================
// Couleurs des embeds
// =====================================================
const COLORS = {
  GREEN: 0x2ecc71, // Validé
  RED: 0xe74c3c, // Refusé
  ORANGE: 0xe67e22, // En attente
  BLUE: 0x3498db, // Entretien démarré
  LIGHT_BLUE: 0x5dade2, // Admin créé
  PURPLE: 0x9b59b6, // Rapport quotidien
  YELLOW: 0xf1c40f, // Rappel
  DARK_RED: 0xc0392b, // Sécurité
  DARK_GREEN: 0x27ae60, // Backup
};

// =====================================================
// Envoyer un webhook Discord
// =====================================================
const sendWebhook = async (webhookUrl: string, payload: DiscordWebhookPayload): Promise<boolean> => {
  if (!webhookUrl || webhookUrl === '') {
    logger.warn('Webhook Discord non configuré, envoi annulé');
    return false;
  }

  try {
    await axios.post(webhookUrl, payload);
    logWebhook('Webhook envoyé avec succès', { url: webhookUrl.substring(0, 50) + '...' });
    return true;
  } catch (error: any) {
    logger.error('Erreur lors de l\'envoi du webhook Discord:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return false;
  }
};

// =====================================================
// Webhook: Entretien démarré
// =====================================================
export const sendEntretienDemarre = async (
  candidat: { nom: string; prenom: string; discord: string },
  admin: AdminSafeData,
  categorie: string
): Promise<boolean> => {
  const embed: DiscordEmbed = {
    title: '🎤 Entretien Whitelist Démarré',
    description: `Un nouvel entretien de whitelist vient de commencer.`,
    color: COLORS.BLUE,
    fields: [
      { name: '👤 Candidat', value: `${candidat.prenom} ${candidat.nom}`, inline: true },
      { name: '💬 Discord', value: candidat.discord, inline: true },
      { name: '📋 Catégorie', value: categorie, inline: true },
      { name: '👨‍💼 Admin responsable', value: admin.username, inline: true },
    ],
    footer: { text: 'FiveM Whitelist Panel' },
    timestamp: new Date().toISOString(),
  };

  return await sendWebhook(WEBHOOKS.ENTRETIEN, { embeds: [embed] });
};

// =====================================================
// Webhook: WL Validée
// =====================================================
export const sendWLValidee = async (
  wl: Whitelist,
  admin: AdminSafeData,
  lien?: string
): Promise<boolean> => {
  const dureeMinutes = Math.round(wl.duree_entretien_secondes / 60);

  const embed: DiscordEmbed = {
    title: '✅ Whitelist Validée',
    description: `Une nouvelle whitelist a été **acceptée** !`,
    color: COLORS.GREEN,
    fields: [
      { name: '👤 Candidat', value: `${wl.candidat_prenom} ${wl.candidat_nom}`, inline: true },
      { name: '💬 Discord', value: wl.discord, inline: true },
      { name: '📊 Score', value: `${wl.score_total.toFixed(2)}/100`, inline: true },
      { name: '📋 Catégorie', value: wl.categorie, inline: true },
      { name: '⏱️ Durée', value: `${dureeMinutes} min`, inline: true },
      { name: '👨‍💼 Admin', value: admin.username, inline: true },
    ],
    footer: { text: 'FiveM Whitelist Panel' },
    timestamp: new Date().toISOString(),
  };

  if (wl.commentaire_decision) {
    embed.fields?.push({
      name: '💬 Commentaire',
      value: wl.commentaire_decision.substring(0, 200),
      inline: false,
    });
  }

  if (lien) {
    embed.fields?.push({
      name: '🔗 Lien',
      value: `[Voir la fiche complète](${lien})`,
      inline: false,
    });
  }

  return await sendWebhook(WEBHOOKS.WL_VALIDEE, { embeds: [embed] });
};

// =====================================================
// Webhook: WL Refusée
// =====================================================
export const sendWLRefusee = async (
  wl: Whitelist,
  admin: AdminSafeData,
  lien?: string
): Promise<boolean> => {
  const embed: DiscordEmbed = {
    title: '❌ Whitelist Refusée',
    description: `Une whitelist a été **refusée**.`,
    color: COLORS.RED,
    fields: [
      { name: '👤 Candidat', value: `${wl.candidat_prenom} ${wl.candidat_nom}`, inline: true },
      { name: '💬 Discord', value: wl.discord, inline: true },
      { name: '📊 Score', value: `${wl.score_total.toFixed(2)}/100`, inline: true },
      { name: '📋 Catégorie', value: wl.categorie, inline: true },
      { name: '👨‍💼 Admin', value: admin.username, inline: true },
    ],
    footer: { text: 'FiveM Whitelist Panel' },
    timestamp: new Date().toISOString(),
  };

  if (wl.raison_refus) {
    embed.fields?.push({
      name: '📝 Raison du refus',
      value: wl.raison_refus,
      inline: false,
    });
  }

  if (wl.refus_temporaire && wl.date_reexamen) {
    embed.fields?.push({
      name: '🔄 Réexamen possible',
      value: `Le ${new Date(wl.date_reexamen).toLocaleDateString('fr-FR')}`,
      inline: false,
    });
  }

  if (lien) {
    embed.fields?.push({
      name: '🔗 Lien',
      value: `[Voir la fiche complète](${lien})`,
      inline: false,
    });
  }

  return await sendWebhook(WEBHOOKS.WL_REFUSEE, { embeds: [embed] });
};

// =====================================================
// Webhook: WL En attente
// =====================================================
export const sendWLEnAttente = async (
  wl: Whitelist,
  admin: AdminSafeData,
  raison: string,
  lien?: string
): Promise<boolean> => {
  const embed: DiscordEmbed = {
    title: '📝 Whitelist En Attente',
    description: `Une whitelist a été mise **en attente**.`,
    color: COLORS.ORANGE,
    fields: [
      { name: '👤 Candidat', value: `${wl.candidat_prenom} ${wl.candidat_nom}`, inline: true },
      { name: '💬 Discord', value: wl.discord, inline: true },
      { name: '📊 Score actuel', value: `${wl.score_total.toFixed(2)}/100`, inline: true },
      { name: '📋 Catégorie', value: wl.categorie, inline: true },
      { name: '👨‍💼 Admin', value: admin.username, inline: true },
      { name: '📝 Raison', value: raison, inline: false },
    ],
    footer: { text: 'FiveM Whitelist Panel' },
    timestamp: new Date().toISOString(),
  };

  if (wl.date_reexamen) {
    embed.fields?.push({
      name: '📅 Date de réexamen',
      value: new Date(wl.date_reexamen).toLocaleDateString('fr-FR'),
      inline: true,
    });
  }

  if (lien) {
    embed.fields?.push({
      name: '🔗 Lien',
      value: `[Voir la fiche complète](${lien})`,
      inline: false,
    });
  }

  return await sendWebhook(WEBHOOKS.WL_ATTENTE, { embeds: [embed] });
};

// =====================================================
// Webhook: Nouvel admin créé
// =====================================================
export const sendAdminCree = async (
  newAdmin: AdminSafeData,
  createdBy: AdminSafeData,
  permissions: string[]
): Promise<boolean> => {
  const embed: DiscordEmbed = {
    title: '👤 Nouvel Administrateur',
    description: `Un nouveau compte administrateur a été créé.`,
    color: COLORS.LIGHT_BLUE,
    fields: [
      { name: '👤 Nom d\'utilisateur', value: newAdmin.username, inline: true },
      { name: '📧 Email', value: newAdmin.email, inline: true },
      { name: '👨‍💼 Créé par', value: createdBy.username, inline: true },
      { name: '🔐 Permissions', value: permissions.join(', ') || 'Aucune', inline: false },
    ],
    footer: { text: 'FiveM Whitelist Panel' },
    timestamp: new Date().toISOString(),
  };

  return await sendWebhook(WEBHOOKS.ADMIN, { embeds: [embed] });
};

// =====================================================
// Webhook: Sécurité - Tentative de connexion suspecte
// =====================================================
export const sendSecurityAlert = async (
  username: string,
  ip: string,
  raison: string
): Promise<boolean> => {
  const embed: DiscordEmbed = {
    title: '⚠️ Alerte Sécurité',
    description: `Une activité suspecte a été détectée.`,
    color: COLORS.DARK_RED,
    fields: [
      { name: '👤 Utilisateur', value: username, inline: true },
      { name: '🌐 Adresse IP', value: ip, inline: true },
      { name: '📝 Raison', value: raison, inline: false },
    ],
    footer: { text: 'FiveM Whitelist Panel - Sécurité' },
    timestamp: new Date().toISOString(),
  };

  return await sendWebhook(WEBHOOKS.SECURITY, { embeds: [embed] });
};

// =====================================================
// Webhook: Backup effectué
// =====================================================
export const sendBackupSuccess = async (
  filename: string,
  size: number
): Promise<boolean> => {
  const embed: DiscordEmbed = {
    title: '💾 Backup Automatique Effectué',
    description: `La sauvegarde automatique de la base de données a été réalisée avec succès.`,
    color: COLORS.DARK_GREEN,
    fields: [
      { name: '📄 Fichier', value: filename, inline: true },
      { name: '💾 Taille', value: `${size.toFixed(2)} MB`, inline: true },
      { name: '✅ Statut', value: 'Succès', inline: true },
    ],
    footer: { text: 'FiveM Whitelist Panel - Backup' },
    timestamp: new Date().toISOString(),
  };

  return await sendWebhook(WEBHOOKS.BACKUP, { embeds: [embed] });
};

// =====================================================
// Webhook: Rappel WL en attente
// =====================================================
export const sendRappelWLAttente = async (count: number): Promise<boolean> => {
  const embed: DiscordEmbed = {
    title: '⏰ Rappel - Whitelists en Attente',
    description: `Il y a actuellement **${count} whitelist(s)** en attente depuis plus de 48 heures.`,
    color: COLORS.YELLOW,
    fields: [
      { name: '📊 Nombre', value: count.toString(), inline: true },
      { name: '⚠️ Action requise', value: 'Veuillez traiter ces whitelists', inline: false },
    ],
    footer: { text: 'FiveM Whitelist Panel - Rappel Automatique' },
    timestamp: new Date().toISOString(),
  };

  return await sendWebhook(WEBHOOKS.RAPPEL, { embeds: [embed] });
};

// =====================================================
// Webhook: Rapport quotidien
// =====================================================
export interface DailyReportData {
  total_wl: number;
  validees: number;
  refusees: number;
  en_attente: number;
  top_admins: Array<{ username: string; count: number }>;
}

export const sendDailyReport = async (data: DailyReportData): Promise<boolean> => {
  const tauxReussite = data.total_wl > 0
    ? ((data.validees / data.total_wl) * 100).toFixed(1)
    : '0.0';

  const topAdminsText = data.top_admins
    .slice(0, 3)
    .map((admin, idx) => `${idx + 1}. ${admin.username} (${admin.count} WL)`)
    .join('\n') || 'Aucune activité';

  const embed: DiscordEmbed = {
    title: '📊 Rapport Quotidien',
    description: `Récapitulatif de l'activité des whitelists d'aujourd'hui.`,
    color: COLORS.PURPLE,
    fields: [
      { name: '📝 Total WL', value: data.total_wl.toString(), inline: true },
      { name: '✅ Validées', value: data.validees.toString(), inline: true },
      { name: '❌ Refusées', value: data.refusees.toString(), inline: true },
      { name: '📝 En attente', value: data.en_attente.toString(), inline: true },
      { name: '📈 Taux de réussite', value: `${tauxReussite}%`, inline: true },
      { name: '\u200B', value: '\u200B', inline: true },
      { name: '🏆 Top 3 Admins', value: topAdminsText, inline: false },
    ],
    footer: { text: 'FiveM Whitelist Panel - Rapport Automatique' },
    timestamp: new Date().toISOString(),
  };

  return await sendWebhook(WEBHOOKS.DAILY_REPORT, { embeds: [embed] });
};

export default {
  sendEntretienDemarre,
  sendWLValidee,
  sendWLRefusee,
  sendWLEnAttente,
  sendAdminCree,
  sendSecurityAlert,
  sendBackupSuccess,
  sendRappelWLAttente,
  sendDailyReport,
};
