import { Request, Response } from 'express';
import { ChatMessage } from '../models/Chat';

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;

    const queryOptions: any = {
      order: [['createdAt', 'ASC']],
    };

    if (limit) {
      queryOptions.limit = parseInt(limit as string);
    }

    const messages = await ChatMessage.findAll(queryOptions);
    res.json(messages);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const admin = (req as any).admin;

    const message = await ChatMessage.create({
      sender: admin.username,
      content,
      isCurrentUser: true,
    });

    res.status(201).json(message);
  } catch (error: any) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
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
    res.json({ message: 'Message deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
