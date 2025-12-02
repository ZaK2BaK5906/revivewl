import { Request, Response } from 'express';
import Whitelist from '../models/Whitelist';

export const getAllWhitelists = async (req: Request, res: Response) => {
  try {
    const { limit, sort, order, status, category } = req.query;

    const queryOptions: any = {
      order: [[sort as string || 'createdAt', order as string || 'DESC']],
    };

    if (limit) {
      queryOptions.limit = parseInt(limit as string);
    }

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    queryOptions.where = where;

    const whitelists = await Whitelist.findAll(queryOptions);
    return res.json(whitelists);
  } catch (error: any) {
    console.error('Error fetching whitelists:', error);
    return res.status(500).json({ error: 'Failed to fetch whitelists' });
  }
};

export const getWhitelistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const whitelist = await Whitelist.findByPk(id);

    if (!whitelist) {
      return res.status(404).json({ error: 'Whitelist not found' });
    }

    return res.json(whitelist);
  } catch (error: any) {
    console.error('Error fetching whitelist:', error);
    return res.status(500).json({ error: 'Failed to fetch whitelist' });
  }
};

export const createWhitelist = async (req: Request, res: Response) => {
  try {
    const whitelistData = req.body;

    // Age validation
    if (whitelistData.age < 18) {
      return res.status(400).json({
        error: 'Le candidat doit avoir au moins 18 ans',
        status: 'refused',
        reason: 'age_restriction'
      });
    }

    const whitelist = await Whitelist.create(whitelistData);
    return res.status(201).json(whitelist);
  } catch (error: any) {
    console.error('Error creating whitelist:', error);
    return res.status(500).json({ error: 'Failed to create whitelist' });
  }
};

export const updateWhitelist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const whitelist = await Whitelist.findByPk(id);
    if (!whitelist) {
      return res.status(404).json({ error: 'Whitelist not found' });
    }

    await whitelist.update(updateData);
    return res.json(whitelist);
  } catch (error: any) {
    console.error('Error updating whitelist:', error);
    return res.status(500).json({ error: 'Failed to update whitelist' });
  }
};

export const deleteWhitelist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const whitelist = await Whitelist.findByPk(id);

    if (!whitelist) {
      return res.status(404).json({ error: 'Whitelist not found' });
    }

    await whitelist.destroy();
    return res.json({ message: 'Whitelist deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting whitelist:', error);
    return res.status(500).json({ error: 'Failed to delete whitelist' });
  }
};

export const getWhitelistStats = async (_req: Request, res: Response) => {
  try {
    const total = await Whitelist.count();
    const validated = await Whitelist.count({ where: { status: 'validated' } });
    const refused = await Whitelist.count({ where: { status: 'refused' } });
    const pending = await Whitelist.count({ where: { status: 'pending' } });

    return res.json({
      total,
      validated,
      refused,
      pending,
    });
  } catch (error: any) {
    console.error('Error fetching whitelist stats:', error);
    return res.status(500).json({ error: 'Failed to fetch whitelist stats' });
  }
};
