import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { addFavorite, getFavorites, deleteFavorite } from '../favoritesController';
import { prisma } from '../../utils/prisma';

vi.mock('../../utils/prisma', () => ({
  prisma: {
    favorite: {
      findFirst: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('FavoritesController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockReq = {
      body: {},
      params: {},
    };
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    vi.clearAllMocks();
  });

  describe('POST /favorites - addFavorite', () => {
    it('should return 200 if favorite already exists', async () => {
      mockReq.body = {
        user_id: 'user-1',
        city_name: 'Paris',
        country_code: 'FR',
      };
      const existingFavorite = {
        id: 1,
        user_id: 'user-1',
        city_name: 'Paris',
        country_code: 'FR',
        created_at: new Date(),
      };
      vi.mocked(prisma.favorite.findFirst).mockResolvedValue(existingFavorite);
      await addFavorite(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Already in favorites',
        favorite: existingFavorite,
      });
    });

    it('should create a new favorite and return 201', async () => {
      mockReq.body = {
        user_id: 'user-1',
        city_name: 'Tokyo',
        country_code: 'JP',
      };
      const newFavorite = {
        id: 2,
        user_id: 'user-1',
        city_name: 'Tokyo',
        country_code: 'JP',
        created_at: new Date(),
      };
      vi.mocked(prisma.favorite.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.favorite.create).mockResolvedValue(newFavorite);
      await addFavorite(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Added to favorites successfully',
        favorite: newFavorite,
      });
    });

    it('should return 500 on database error', async () => {
      mockReq.body = {
        user_id: 'user-1',
        city_name: 'Berlin',
        country_code: 'DE',
      };
      vi.mocked(prisma.favorite.findFirst).mockRejectedValue(
        new Error('Database error')
      );
      await addFavorite(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('GET /favorites/:userId - getFavorites', () => {
    it('should return all favorites for a user', async () => {
      mockReq.params = { userId: 'user-1' };
      const mockFavorites = [
        {
          id: 1,
          user_id: 'user-1',
          city_name: 'Paris',
          country_code: 'FR',
          created_at: new Date(),
        },
        {
          id: 2,
          user_id: 'user-1',
          city_name: 'Tokyo',
          country_code: 'JP',
          created_at: new Date(),
        },
      ];
      vi.mocked(prisma.favorite.findMany).mockResolvedValue(mockFavorites);
      await getFavorites(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockFavorites);
    });

    it('should return empty array if user has no favorites', async () => {
      mockReq.params = { userId: 'user-2' };
      vi.mocked(prisma.favorite.findMany).mockResolvedValue([]);
      await getFavorites(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([]);
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { userId: 'user-1' };
      vi.mocked(prisma.favorite.findMany).mockRejectedValue(
        new Error('Database error')
      );
      await getFavorites(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Error fetching favorites',
      });
    });
  });

  describe('DELETE /favorites/:id - deleteFavorite', () => {
    it('should delete a favorite and return 200', async () => {
      mockReq.params = { id: '1' };
      vi.mocked(prisma.favorite.delete).mockResolvedValue({
        id: 1,
        user_id: 'user-1',
        city_name: 'Paris',
        country_code: 'FR',
        created_at: new Date(),
      });
      await deleteFavorite(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Favorite deleted successfully',
      });
      expect(prisma.favorite.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { id: '999' };
      vi.mocked(prisma.favorite.delete).mockRejectedValue(
        new Error('Record not found')
      );
      await deleteFavorite(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Error deleting favorite',
      });
    });
  });
});
