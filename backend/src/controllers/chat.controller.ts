import { Request, Response } from 'express';
import { ChatMessage } from '../models/Chat';
import Admin from '../models/Admin';

// Helper: Transform DB message to frontend format
const transformMessageForFrontend = async (message: any, currentAdminId: number) => {
  const messageData = message.toJSON ? message.toJSON() : message;

  // Get sender admin info
  const sender = await Admin.findByPk(messageData.admin_id);
  const senderUsername = sender ? sender.username : 'Unknown';

  return {
    id: messageData.id,
    sender: senderUsername,
    content: messageData.message,
    timestamp: messageData.created_at,
    isCurrentUser: messageData.admin_id === currentAdminId,
  };
};

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const { limit, room } = req.query;
    const currentAdmin = (req as any).admin;

    const queryOptions: any = {
      order: [['created_at', 'ASC']],
      limit: limit ? parseInt(limit as string) : 100,
    };

    if (room) {
      queryOptions.where = { room };
    } else {
      queryOptions.where = { room: 'general' };
    }

    const messages = await ChatMessage.findAll(queryOptions);

    // Transform all messages to frontend format
    const transformedMessages = await Promise.all(
      messages.map(msg => transformMessageForFrontend(msg, currentAdmin.id))
    );

    return res.json(transformedMessages);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message, room } = req.body;
    const admin = (req as any).admin;

    const newMessage = await ChatMessage.create({
      admin_id: admin.id,
      room: room || 'general',
      message: message, // Frontend sends 'message', we store in 'message' field
      attachments: null,
      is_edited: false,
    });

    // Transform to frontend format
    const transformed = await transformMessageForFrontend(newMessage, admin.id);

    return res.status(201).json(transformed);
  } catch (error: any) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await ChatMessage.findByPk(id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await message.destroy();
    return res.json({ message: 'Message deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ error: 'Failed to delete message' });
  }
};

// NEW: Get online admins
export const getOnlineAdmins = async (_req: Request, res: Response) => {
  try {
    const admins = await Admin.findAll({
      attributes: ['id', 'username', 'is_master', 'last_login'],
      order: [['username', 'ASC']],
    });

    // Transform to frontend format
    const transformedAdmins = admins.map((admin: any) => {
      const adminData = admin.toJSON();
      const lastLogin = adminData.last_login ? new Date(adminData.last_login) : null;
      const now = new Date();
      const minutesSinceLogin = lastLogin ? (now.getTime() - lastLogin.getTime()) / 60000 : 9999;

      // Determine status based on last login
      let status = 'offline';
      if (minutesSinceLogin < 5) status = 'online';
      else if (minutesSinceLogin < 30) status = 'away';

      return {
        id: adminData.id,
        username: adminData.username,
        status,
        role: adminData.is_master ? 'Master Admin' : 'Modérateur',
      };
    });

    return res.json(transformedAdmins);
  } catch (error: any) {
    console.error('Error fetching online admins:', error);
    return res.status(500).json({ error: 'Failed to fetch admins' });
  }
};
