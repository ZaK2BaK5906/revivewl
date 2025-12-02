import { Request, Response } from 'express';
import { Ticket, TicketComment } from '../models/Ticket';
import sequelize from '../config/database';

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const { status, priority } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tickets = await Ticket.findAll({
      where,
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('comments.id')), 'messages']
        ]
      },
      include: [
        {
          model: TicketComment,
          as: 'comments',
          attributes: []
        }
      ],
      group: ['Ticket.id'],
      order: [['created_at', 'DESC']],
      raw: false,
      subQuery: false,
    });

    return res.json(tickets);
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    return res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id, {
      include: [{ model: TicketComment, as: 'comments' }],
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return res.json(ticket);
  } catch (error: any) {
    console.error('Error fetching ticket:', error);
    return res.status(500).json({ error: 'Failed to fetch ticket' });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { title, description, type, priority } = req.body;
    const admin = (req as any).admin;

    const ticket = await Ticket.create({
      title,
      description,
      type: type || 'Autre',
      priority: priority || 'Normale',
      status: 'Ouvert',
      created_by: admin.id,
      assigned_to: null,
    });

    return res.status(201).json(ticket);
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    return res.status(500).json({ error: 'Failed to create ticket' });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    await ticket.update(req.body);
    return res.json(ticket);
  } catch (error: any) {
    console.error('Error updating ticket:', error);
    return res.status(500).json({ error: 'Failed to update ticket' });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    await ticket.destroy();
    return res.json({ message: 'Ticket deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting ticket:', error);
    return res.status(500).json({ error: 'Failed to delete ticket' });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { comment } = req.body;
    const admin = (req as any).admin;

    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const newComment = await TicketComment.create({
      ticket_id: parseInt(ticketId),
      admin_id: admin.id,
      comment,
      attachments: null,
    });

    return res.status(201).json(newComment);
  } catch (error: any) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ error: 'Failed to add comment' });
  }
};
