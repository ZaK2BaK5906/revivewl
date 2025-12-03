import { Request, Response } from 'express';
import { DiscordWebhook, WebhookLog } from '../models/Webhook';
import axios from 'axios';

// Get all webhooks
export const getAllWebhooks = async (_req: Request, res: Response) => {
  try {
    const webhooks = await DiscordWebhook.findAll({
      order: [['created_at', 'DESC']],
    });
    return res.json(webhooks);
  } catch (error: any) {
    console.error('Error fetching webhooks:', error);
    return res.status(500).json({ error: 'Failed to fetch webhooks' });
  }
};

// Get webhook by ID
export const getWebhookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const webhook = await DiscordWebhook.findByPk(id, {
      include: [
        {
          model: WebhookLog,
          as: 'logs',
          limit: 10,
          order: [['created_at', 'DESC']],
        },
      ],
    });

    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    return res.json(webhook);
  } catch (error: any) {
    console.error('Error fetching webhook:', error);
    return res.status(500).json({ error: 'Failed to fetch webhook' });
  }
};

// Create new webhook
export const createWebhook = async (req: Request, res: Response) => {
  try {
    const { name, webhook_url, event_type, is_active } = req.body;

    if (!name || !webhook_url || !event_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const webhook = await DiscordWebhook.create({
      name,
      webhook_url,
      event_type,
      is_active: is_active !== undefined ? is_active : true,
    });

    return res.status(201).json(webhook);
  } catch (error: any) {
    console.error('Error creating webhook:', error);
    return res.status(500).json({ error: 'Failed to create webhook' });
  }
};

// Update webhook
export const updateWebhook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const webhook = await DiscordWebhook.findByPk(id);

    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    await webhook.update(req.body);
    return res.json(webhook);
  } catch (error: any) {
    console.error('Error updating webhook:', error);
    return res.status(500).json({ error: 'Failed to update webhook' });
  }
};

// Delete webhook
export const deleteWebhook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const webhook = await DiscordWebhook.findByPk(id);

    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    await webhook.destroy();
    return res.json({ message: 'Webhook deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting webhook:', error);
    return res.status(500).json({ error: 'Failed to delete webhook' });
  }
};

// Test webhook
export const testWebhook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const webhook = await DiscordWebhook.findByPk(id);

    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    const testPayload = {
      content: '🔔 Test webhook notification',
      embeds: [
        {
          title: 'Test Webhook',
          description: 'This is a test notification from ReviveWL Admin Panel',
          color: 0x00ff00,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const response = await sendWebhook(webhook.webhook_url, testPayload);

    // Log the test
    await WebhookLog.create({
      webhook_id: webhook.id,
      payload: JSON.stringify(testPayload),
      response_status: response.status,
      response_body: response.statusText,
    });

    return res.json({ message: 'Webhook test sent successfully', status: response.status });
  } catch (error: any) {
    console.error('Error testing webhook:', error);
    return res.status(500).json({ error: 'Failed to test webhook', details: error.message });
  }
};

// Send webhook notification
export const sendWebhook = async (url: string, payload: any) => {
  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error: any) {
    console.error('Error sending webhook:', error);
    throw error;
  }
};

// Trigger webhook for specific event
export const triggerWebhook = async (eventType: string, data: any) => {
  try {
    const webhooks = await DiscordWebhook.findAll({
      where: {
        event_type: eventType,
        is_active: true,
      },
    });

    for (const webhook of webhooks) {
      try {
        const payload = formatWebhookPayload(eventType, data);
        const response = await sendWebhook(webhook.webhook_url, payload);

        // Log the webhook call
        await WebhookLog.create({
          webhook_id: webhook.id,
          payload: JSON.stringify(payload),
          response_status: response.status,
          response_body: response.statusText,
        });
      } catch (error: any) {
        console.error(`Error sending webhook ${webhook.id}:`, error);
        // Log the failed attempt
        await WebhookLog.create({
          webhook_id: webhook.id,
          payload: JSON.stringify(data),
          response_status: error.response?.status || 0,
          response_body: error.message,
        });
      }
    }
  } catch (error: any) {
    console.error('Error triggering webhooks:', error);
  }
};

// Format webhook payload based on event type
const formatWebhookPayload = (eventType: string, data: any) => {
  switch (eventType) {
    case 'wl_validated':
      return {
        embeds: [
          {
            title: '✅ Whitelist Validée',
            description: `**${data.candidate_firstname} ${data.candidate_lastname}** a été validé(e)`,
            color: 0x00ff00,
            fields: [
              { name: 'Discord', value: data.discord_username, inline: true },
              { name: 'Catégorie', value: data.category || 'N/A', inline: true },
              { name: 'Score', value: `${data.total_score}/100`, inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };

    case 'wl_refused':
      return {
        embeds: [
          {
            title: '❌ Whitelist Refusée',
            description: `**${data.candidate_firstname} ${data.candidate_lastname}** a été refusé(e)`,
            color: 0xff0000,
            fields: [
              { name: 'Discord', value: data.discord_username, inline: true },
              { name: 'Raison', value: data.refusal_reason || 'Non spécifiée', inline: false },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };

    case 'wl_created':
      return {
        embeds: [
          {
            title: '📝 Nouvelle Whitelist',
            description: `**${data.candidate_firstname} ${data.candidate_lastname}** - En cours`,
            color: 0xffa500,
            fields: [
              { name: 'Discord', value: data.discord_username, inline: true },
              { name: 'Âge', value: `${data.age} ans`, inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };

    case 'ticket_created':
      return {
        embeds: [
          {
            title: '🎫 Nouveau Ticket',
            description: `**${data.title}**`,
            color: 0x0099ff,
            fields: [
              { name: 'Priorité', value: data.priority, inline: true },
              { name: 'Catégorie', value: data.category, inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };

    default:
      return {
        content: `Event: ${eventType}`,
        embeds: [
          {
            title: 'Event Notification',
            description: JSON.stringify(data),
            color: 0x808080,
            timestamp: new Date().toISOString(),
          },
        ],
      };
  }
};
