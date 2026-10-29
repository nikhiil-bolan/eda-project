import { Response } from 'express';
import prisma from '../db';
import { AuthenticatedRequest } from '../middleware/auth';

export async function toggleFavorite(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { stationId } = req.body;

    if (!userId || !stationId) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_DATA', message: 'User and Station ID are required.' }
      });
    }

    const existing = await prisma.favoriteStation.findUnique({
      where: {
        userId_stationId: { userId, stationId }
      }
    });

    if (existing) {
      await prisma.favoriteStation.delete({
        where: { id: existing.id }
      });
      return res.status(200).json({
        success: true,
        data: { isFavorite: false, message: 'Station removed from favorites.' }
      });
    } else {
      await prisma.favoriteStation.create({
        data: { userId, stationId }
      });
      return res.status(201).json({
        success: true,
        data: { isFavorite: true, message: 'Station added to favorites.' }
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Unable to update favorites.' }
    });
  }
}

export async function getUserFavorites(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } });
    }

    const favorites = await prisma.favoriteStation.findMany({
      where: { userId },
      include: {
        station: {
          include: {
            connectors: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: { favorites }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Unable to fetch favorites.' }
    });
  }
}
