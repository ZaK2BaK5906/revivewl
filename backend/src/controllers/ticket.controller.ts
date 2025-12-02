import { Request, Response } from 'express';
import { Ticket, TicketComment } from '../models/Ticket';

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const { status, priority } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tickets = await Ticket.findAll({
      where,
      include: [{ model: TicketComment, as: 'comments' }],
      order: [['createdAt', 'DESC']],
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
    const ticket = await Ticket.create({
      ...req.body,
      status: 'ouvert',
      author: (req as any).admin.username,
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
    const { content } = req.body;

    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const comment = await TicketComment.create({
      ticketId: parseInt(ticketId),
      author: (req as any).admin.username,
      content,
    });

    return res.status(201).json(comment);
  } catch (error: any) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ error: 'Failed to add comment' });
  }
};
