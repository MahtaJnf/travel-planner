import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../auth';
import jwt from 'jsonwebtoken';

vi.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockNext = vi.fn();
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    vi.clearAllMocks();
    process.env.ACCESS_TOKEN_SECRET = 'test-access-secret-key-minimum-32-chars';
  });

  describe('authenticateToken', () => {
    it('should return 401 if no authorization header is provided', () => {
      mockReq.headers = {};
      authenticateToken(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Access token required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization header has no token', () => {
      mockReq.headers = {
        authorization: 'Bearer ',
      };
      authenticateToken(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Access token required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 500 if ACCESS_TOKEN_SECRET is missing', () => {
      delete process.env.ACCESS_TOKEN_SECRET;
      mockReq.headers = {
        authorization: 'Bearer valid-token',
      };
      authenticateToken(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Server configuration error',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 with expired flag when token is expired', () => {
      mockReq.headers = {
        authorization: 'Bearer expired-token',
      };
      const expiredError = new Error('jwt expired');
      expiredError.name = 'TokenExpiredError';
      vi.mocked(jwt.verify).mockImplementation((token, secret, callback: any) => {
        callback(expiredError, null);
      });

      authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Token expired',
        expired: true,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', () => {
      mockReq.headers = {
        authorization: 'Bearer invalid-token',
      };
      const invalidError = new Error('invalid token');
      invalidError.name = 'JsonWebTokenError';
      vi.mocked(jwt.verify).mockImplementation((token, secret, callback: any) => {
        callback(invalidError, null);
      });

      authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should attach user to request and call next() on valid token', () => {
      mockReq.headers = {
        authorization: 'Bearer valid-token',
      };
      const mockUser = {
        id: 'user-123',
        email: 'test@test.com',
      };
      vi.mocked(jwt.verify).mockImplementation((token, secret, callback: any) => {
        callback(null, mockUser);
      });
      authenticateToken(mockReq as Request, mockRes as Response, mockNext);
      expect((mockReq as any).user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it('should extract token from Bearer format correctly', () => {
      const testToken = 'my-jwt-token-here';
      mockReq.headers = {
        authorization: `Bearer ${testToken}`,
      };
      const mockUser = {
        id: 'user-456',
        email: 'user@example.com',
      };
      vi.mocked(jwt.verify).mockImplementation((token, secret, callback: any) => {
        expect(token).toBe(testToken);
        callback(null, mockUser);
      });
      authenticateToken(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should use ACCESS_TOKEN_SECRET for verification', () => {
      const testSecret = 'my-secret-key-for-testing-purposes-123';
      process.env.ACCESS_TOKEN_SECRET = testSecret;

      mockReq.headers = {
        authorization: 'Bearer test-token',
      };
      vi.mocked(jwt.verify).mockImplementation((token, secret, callback: any) => {
        expect(secret).toBe(testSecret);
        callback(null, { id: 'user-1' });
      });

      authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle authorization header without Bearer prefix', () => {
      mockReq.headers = {
        authorization: 'just-a-token-without-bearer',
      };
      authenticateToken(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Access token required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
