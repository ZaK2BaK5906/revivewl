import { Request, Response } from 'express';
import { Ticket, TicketComment } from '../models/Ticket';
import Admin from '../models/Admin';

// Helper: Capitalize first letter (frontend minuscules → DB Majuscules)
const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Helper: Map frontend category to DB type
const mapCategoryToType = (category: string): string => {
  const mapping: {[key: string]: string} = {
    'technique': 'Bug',
    'whitelist': 'Question',
    'autre': 'Autre',
  };
  return mapping[category.toLowerCase()] || 'Autre';
};

// Helper: Map DB type to frontend category
const mapTypeToCategory = (type: string): string => {
  const mapping: {[key: string]: string} = {
    'Bug': 'technique',
    'Question': 'whitelist',
    'Suggestion': 'autre',
    'Autre': 'autre',
  };
  return mapping[type] || 'autre';
};

// Helper: Transform DB ticket to frontend format
const transformTicketForFrontend = async (ticket: any) => {
  const ticketData = ticket.toJSON ? ticket.toJSON() : ticket;

  // Get author username
  const author = await Admin.findByPk(ticketData.created_by);
  const authorUsername = author ? author.username : 'Unknown';

  // Get assigned admin username if exists
  let assignedToUsername = null;
  if (ticketData.assigned_to) {
    const assignedAdmin = await Admin.findByPk(ticketData.assigned_to);
    assignedToUsername = assignedAdmin ? assignedAdmin.username : null;
  }

  // Count comments
  const messages = ticketData.messages || 0;

  return {
    id: ticketData.id,
    title: ticketData.title,
    description: ticketData.description,
    status: ticketData.status.toLowerCase().replace(' ', '_'), // 'Ouvert' → 'ouvert', 'En cours' → 'en_cours'
    priority: ticketData.priority.toLowerCase(), // 'Basse' → 'basse'
    category: mapTypeToCategory(ticketData.type),
    author: authorUsername,
    assignedTo: assignedToUsername,
    createdAt: ticketData.created_at || ticketData.createdAt,
    updatedAt: ticketData.updated_at || ticketData.updatedAt,
    messages,
  };
};

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const { status, priority } = req.query;

    const where: any = {};

    // Transform frontend status to DB status
    if (status) {
      const dbStatus = status === 'en_cours' ? 'En cours' : capitalize(status as string);
      where.status = dbStatus;
    }

    // Transform frontend priority to DB priority
    if (priority) {
      where.priority = capitalize(priority as string);
    }

    const tickets = await Ticket.findAll({
      where,
      include: [
        {
          model: TicketComment,
          as: 'comments',
          attributes: [],
        }
      ],
      attributes: {
        include: [
          [Admin.sequelize!.fn('COUNT', Admin.sequelize!.col('comments.id')), 'messages']
        ]
      },
      group: ['Ticket.id'],
      // Order by priority first (Urgente -> Haute -> Normale -> Basse), then by date
      order: [
        [Admin.sequelize!.literal("FIELD(priority, 'Urgente', 'Haute', 'Normale', 'Basse')"), 'ASC'],
        ['created_at', 'DESC']
      ],
      raw: false,
      subQuery: false,
    });

    // Transform all tickets to frontend format
    const transformedTickets = await Promise.all(
      tickets.map(ticket => transformTicketForFrontend(ticket))
    );

    return res.json(transformedTickets);
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

    const transformed = await transformTicketForFrontend(ticket);
    return res.json(transformed);
  } catch (error: any) {
    console.error('Error fetching ticket:', error);
    return res.status(500).json({ error: 'Failed to fetch ticket' });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, category } = req.body;
    const admin = (req as any).admin;

    // Transform frontend data to DB format
    const ticketData = {
      title,
      description,
      type: mapCategoryToType(category || 'autre'),
      priority: capitalize(priority || 'normale'), // 'normale' → 'Normale'
      status: 'Ouvert',
      created_by: admin.id,
      assigned_to: null,
    };

    const ticket = await Ticket.create(ticketData);
    const transformed = await transformTicketForFrontend(ticket);

    return res.status(201).json(transformed);
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

    // Transform frontend data to DB format
    const updateData: any = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.status) {
      updateData.status = req.body.status === 'en_cours' ? 'En cours' : capitalize(req.body.status);
    }
    if (req.body.priority) updateData.priority = capitalize(req.body.priority);
    if (req.body.category) updateData.type = mapCategoryToType(req.body.category);

    await ticket.update(updateData);
    const transformed = await transformTicketForFrontend(ticket);

    return res.json(transformed);
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
