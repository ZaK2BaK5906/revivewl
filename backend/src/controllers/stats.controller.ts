import { Request, Response } from 'express';
import Whitelist from '../models/Whitelist';
import Admin from '../models/Admin';
import sequelize from '../config/database';
import { Op } from 'sequelize';

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    // Whitelist stats
    const total = await Whitelist.count();
    const validated = await Whitelist.count({ where: { status: 'validated' } });
    const refused = await Whitelist.count({ where: { status: 'refused' } });
    const pending = await Whitelist.count({ where: { status: 'pending' } });

    // Today's interviews
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayInterviews = await Whitelist.count({
      where: {
        created_at: {
          [Op.gte]: today,
        },
      },
    });

    // Success rate (validated / total completed)
    const completed = validated + refused;
    const successRate = completed > 0 ? Math.round((validated / completed) * 100) : 0;

    // Recent whitelists
    const recentWhitelists = await Whitelist.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
    });

    // Top admins (by whitelist count)
    const topAdmins = await Admin.findAll({
      attributes: [
        'id',
        'username',
        [sequelize.fn('COUNT', sequelize.col('Whitelists.id')), 'count'],
      ],
      include: [
        {
          model: Whitelist,
          as: 'Whitelists',
          attributes: [],
        },
      ],
      group: ['Admin.id'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 3,
      raw: true,
    });

    return res.json({
      stats: {
        total,
        validated,
        refused,
        pending,
        todayInterviews,
        avgDuration: 25, // Placeholder
        successRate,
      },
      recentWhitelists,
      topAdmins,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

export const getWhitelistStats = async (req: Request, res: Response) => {
  try {
    const { period } = req.query;

    let dateFilter: any = {};
    if (period) {
      const now = new Date();
      switch (period) {
        case 'today':
          dateFilter = {
            created_at: {
              [Op.gte]: new Date(now.setHours(0, 0, 0, 0)),
            },
          };
          break;
        case 'week':
          dateFilter = {
            created_at: {
              [Op.gte]: new Date(now.setDate(now.getDate() - 7)),
            },
          };
          break;
        case 'month':
          dateFilter = {
            created_at: {
              [Op.gte]: new Date(now.setMonth(now.getMonth() - 1)),
            },
          };
          break;
      }
    }

    const total = await Whitelist.count({ where: dateFilter });
    const validated = await Whitelist.count({
      where: { ...dateFilter, status: 'validated' },
    });
    const refused = await Whitelist.count({
      where: { ...dateFilter, status: 'refused' },
    });
    const pending = await Whitelist.count({
      where: { ...dateFilter, status: 'pending' },
    });

    return res.json({
      total,
      validated,
      refused,
      pending,
      period: period || 'all',
    });
  } catch (error: any) {
    console.error('Error fetching whitelist stats:', error);
    return res.status(500).json({ error: 'Failed to fetch whitelist stats' });
  }
};

export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const totalAdmins = await Admin.count();
    const masterAdmins = await Admin.count({ where: { is_master: true } });
    const regularAdmins = await Admin.count({ where: { is_master: false } });

    return res.json({
      total: totalAdmins,
      masterAdmins,
      regularAdmins,
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};
