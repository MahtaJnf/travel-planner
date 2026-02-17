import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { getWeatherData, getForecastData } from '../weatherController';
import axios from 'axios';
vi.mock('axios');

describe('WeatherController', () => {
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
    process.env.WEATHER_API_KEY = 'test-api-key';
  });

  describe('GET /weather - getWeatherData', () => {
    it('should return 400 if city is missing', async () => {
      mockReq.query = {};
      await getWeatherData(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'City is required',
      });
    });

    it('should return weather data on successful API call', async () => {
      mockReq.query = { city: 'London' };
      const mockWeatherData = {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky' }],
        main: { temp: 20.5, feels_like: 19.8, pressure: 1013, humidity: 65 },
        name: 'London',
      };
      vi.mocked(axios.get).mockResolvedValue({ data: mockWeatherData });
      await getWeatherData(mockReq as Request, mockRes as Response, vi.fn());
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: 'London',
            appid: 'test-api-key',
            units: 'metric',
          },
        }
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: mockWeatherData,
      });
    });

    it('should return 500 on API error', async () => {
      mockReq.query = { city: 'InvalidCity' };
      vi.mocked(axios.get).mockRejectedValue(new Error('API Error'));
      await getWeatherData(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch weather data',
      });
    });
  });

  describe('GET /forecast - getForecastData', () => {
    it('should return 400 if city is missing', async () => {
      mockReq.query = {};
      await getForecastData(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'City is required',
      });
    });

    it('should return forecast data on successful API call', async () => {
      mockReq.query = { city: 'Paris' };
      const mockForecastData = {
        list: [
          {
            dt: 1634540400,
            main: { temp: 18.5, feels_like: 17.8 },
            weather: [{ main: 'Clouds', description: 'few clouds' }],
          },
          {
            dt: 1634551200,
            main: { temp: 19.2, feels_like: 18.5 },
            weather: [{ main: 'Clear', description: 'clear sky' }],
          },
        ],
        city: { name: 'Paris', country: 'FR' },
      };

      vi.mocked(axios.get).mockResolvedValue({ data: mockForecastData });

      await getForecastData(mockReq as Request, mockRes as Response, vi.fn());

      expect(axios.get).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/forecast',
        {
          params: {
            q: 'Paris',
            appid: 'test-api-key',
            units: 'metric',
          },
        }
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: mockForecastData,
      });
    });

    it('should return 500 on API error', async () => {
      mockReq.query = { city: 'InvalidCity' };

      vi.mocked(axios.get).mockRejectedValue(new Error('API Error'));

      await getForecastData(mockReq as Request, mockRes as Response, vi.fn());

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch weather data',
      });
    });
  });
});
