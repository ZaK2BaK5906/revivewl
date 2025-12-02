// =====================================================
// MIDDLEWARE - 404 Not Found
// =====================================================

import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const response: ApiResponse = {
    success: false,
    message: `Route non trouvée: ${req.method} ${req.originalUrl}`,
  };

  res.status(404).json(response);
};
