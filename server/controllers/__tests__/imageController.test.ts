import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { getImages, getTouristImages } from '../imageController';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ImageController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockReq = {
      query: {},
    };
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    vi.clearAllMocks();
    process.env.UNSPLASH_ACCESS_KEY = 'test-unsplash-key';
  });

  describe('GET /images - getImages', () => {
    it('should return 400 if city is missing', async () => {
      mockReq.query = {};
      await getImages(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Missing city or Unsplash access key',
      });
    });

    it('should return 400 if Unsplash access key is missing', async () => {
      mockReq.query = { city: 'Paris' };
      delete process.env.UNSPLASH_ACCESS_KEY;
      await getImages(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Missing city or Unsplash access key',
      });
    });

    it('should return images on successful API call', async () => {
      mockReq.query = { city: 'Tokyo' };
      const mockUnsplashData = {
        results: [
          { urls: { regular: 'https://image1.jpg' } },
          { urls: { regular: 'https://image2.jpg' } },
          { urls: { regular: 'https://image3.jpg' } },
        ],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockUnsplashData,
      });
      await getImages(mockReq as Request, mockRes as Response);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.unsplash.com/search/photos?query=cities%20Tokyo&per_page=10&orientation=landscape',
        {
          headers: {
            Authorization: 'Client-ID test-unsplash-key',
          },
        }
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        images: ['https://image1.jpg', 'https://image2.jpg', 'https://image3.jpg'],
      });
    });

    it('should return 404 if no images found', async () => {
      mockReq.query = { city: 'UnknownCity' };
      const mockUnsplashData = {
        results: [],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockUnsplashData,
      });
      await getImages(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'No images found for that city',
      });
    });

    it('should return 500 on API error', async () => {
      mockReq.query = { city: 'London' };
      mockFetch.mockRejectedValue(new Error('API Error'));
      await getImages(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch images',
      });
    });
  });

  describe('GET /tourist-images - getTouristImages', () => {
    it('should return 400 if city is missing', async () => {
      mockReq.query = {};
      await getTouristImages(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Missing city or Unsplash access key',
      });
    });

    it('should return tourist images on successful API call', async () => {
      mockReq.query = { city: 'Rome' };
      const mockUnsplashData = {
        results: [
          { urls: { regular: 'https://tourist1.jpg' } },
          { urls: { regular: 'https://tourist2.jpg' } },
        ],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockUnsplashData,
      });
      await getTouristImages(mockReq as Request, mockRes as Response);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.unsplash.com/search/photos?query=tourists%20Rome&per_page=10&orientation=landscape',
        {
          headers: {
            Authorization: 'Client-ID test-unsplash-key',
          },
        }
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        touristImages: ['https://tourist1.jpg', 'https://tourist2.jpg'],
      });
    });

    it('should return Unsplash error status when API fails', async () => {
      mockReq.query = { city: 'Paris' };
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        text: async () => 'Rate limit exceeded',
      });
      await getTouristImages(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(429);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Unsplash API limit reached or error occurred',
      });
    });

    it('should return 404 if no tourist images found', async () => {
      mockReq.query = { city: 'UnknownCity' };
      const mockUnsplashData = {
        results: [],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockUnsplashData,
      });
      await getTouristImages(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'No images found for that city',
      });
    });

    it('should return 500 on API error', async () => {
      mockReq.query = { city: 'Berlin' };
      mockFetch.mockRejectedValue(new Error('Network error'));
      await getTouristImages(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch images',
      });
    });
  });
});
