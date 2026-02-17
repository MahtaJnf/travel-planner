import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { getCountryData } from '../countryController';
import axios from 'axios';

vi.mock('axios');

describe('CountryController', () => {
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
  });

  describe('GET /country - getCountryData', () => {
    it('should return 400 if country code is missing', async () => {
      mockReq.query = {};
      await getCountryData(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Country code is required',
      });
    });

    it('should return country data on successful API call', async () => {
      mockReq.query = { code: 'US' };
      const mockCountryData = [
        {
          name: {
            common: 'United States',
            official: 'United States of America',
          },
          capital: ['Washington, D.C.'],
          population: 331002651,
          region: 'Americas',
          subregion: 'North America',
          languages: { eng: 'English' },
          currencies: {
            USD: {
              name: 'United States dollar',
              symbol: '$',
            },
          },
          flags: {
            png: 'https://flagcdn.com/w320/us.png',
            svg: 'https://flagcdn.com/us.svg',
          },
        },
      ];
      vi.mocked(axios.get).mockResolvedValue({ data: mockCountryData });
      await getCountryData(mockReq as Request, mockRes as Response, vi.fn());
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/alpha/US');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: mockCountryData,
      });
    });

    it('should return 404 if country not found', async () => {
      mockReq.query = { code: 'INVALID' };
      vi.mocked(axios.get).mockResolvedValue({ data: [] });
      await getCountryData(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Country not found',
      });
    });

    it('should return 500 on API error', async () => {
      mockReq.query = { code: 'FR' };
      vi.mocked(axios.get).mockRejectedValue(new Error('API Error'));
      await getCountryData(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch country data',
      });
    });

    it('should handle multiple country codes', async () => {
      mockReq.query = { code: 'JP' };
      const mockCountryData = [
        {
          name: {
            common: 'Japan',
            official: 'Japan',
          },
          capital: ['Tokyo'],
          population: 125836021,
          region: 'Asia',
          subregion: 'Eastern Asia',
          languages: { jpn: 'Japanese' },
          currencies: {
            JPY: {
              name: 'Japanese yen',
              symbol: '¥',
            },
          },
        },
      ];

      vi.mocked(axios.get).mockResolvedValue({ data: mockCountryData });
      await getCountryData(mockReq as Request, mockRes as Response, vi.fn());
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/alpha/JP');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: mockCountryData,
      });
    });
  });
});
