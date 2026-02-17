import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { login, register, logout, token } from '../authController';
import { prisma } from '../../utils/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

vi.mock('../../utils/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('AuthController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockReq = {
      body: {},
    };
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    vi.clearAllMocks();
    process.env.ACCESS_TOKEN_SECRET = 'test-access-secret-key-minimum-32-chars';
    process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret-key-minimum-32-chars';
  });

  describe('POST /login', () => {
    it('should return 400 if email is missing', async () => {
      mockReq.body = { password: 'password123' };
      await login(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Email and password are required',
      });
    });

    it('should return 400 if password is missing', async () => {
      mockReq.body = { email: 'test@test.com' };
      await login(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Email and password are required',
      });
    });

    it('should return 401 if user does not exist', async () => {
      mockReq.body = { email: 'nonexistent@test.com', password: 'password123' };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      await login(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid email or password',
      });
    });

    it('should return 401 if password is invalid', async () => {
      mockReq.body = { email: 'test@test.com', password: 'wrongpassword' };
      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        hashed_password: 'hashed-password',
        emailVerifiedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
      await login(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid email or password',
      });
    });

    it('should return tokens and user data on successful login', async () => {
      mockReq.body = { email: 'test@test.com', password: 'correctpassword' };
      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        hashed_password: 'hashed-password',
        emailVerifiedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockAccessToken = 'mock-access-token';
      const mockRefreshToken = 'mock-refresh-token';
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign)
        .mockReturnValueOnce(mockAccessToken as any)
        .mockReturnValueOnce(mockRefreshToken as any);

      await login(mockReq as Request, mockRes as Response, vi.fn());

      expect(jsonMock).toHaveBeenCalledWith({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        user: { id: 'user-1', email: 'test@test.com' },
      });
    });
  });

  describe('POST /register', () => {
    it('should return 400 if email is missing', async () => {
      mockReq.body = { password: 'password123' };
      await register(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Email and password are required',
      });
    });

    it('should return 400 if password is missing', async () => {
      mockReq.body = { email: 'test@test.com' };
      await register(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Email and password are required',
      });
    });

    it('should return 409 if user already exists', async () => {
      mockReq.body = { email: 'existing@test.com', password: 'password123' };
      const existingUser = {
        id: 'user-1',
        email: 'existing@test.com',
        hashed_password: 'hashed-password',
        emailVerifiedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser);
      await register(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'User already exists',
      });
    });

    it('should create a new user and return 201', async () => {
      mockReq.body = { email: 'newuser@test.com', password: 'password123' };

      const newUser = {
        id: 'user-2',
        email: 'newuser@test.com',
        hashed_password: 'hashed-password',
        emailVerifiedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);
      vi.mocked(prisma.user.create).mockResolvedValue(newUser);
      await register(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: { id: 'user-2', email: 'newuser@test.com' },
      });
    });
  });

  describe('DELETE /logout', () => {
    it('should return 204 on successful logout', async () => {
      mockReq.body = { token: 'refresh-token-to-delete' };
      await logout(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });
  });

  describe('POST /token', () => {
    it('should return 401 if no refresh token provided', async () => {
      mockReq.body = {};
      await token(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
    });

    it('should return 403 if refresh token is not in the list', async () => {
      mockReq.body = { token: 'invalid-refresh-token' };
      await token(mockReq as Request, mockRes as Response, vi.fn());
      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Forbidden',
      });
    });
  });
});
