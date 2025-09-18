
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    // TODO:  1. Authenticate user with email and pass

    const email = req.body.email;
    const password = req.body.password;
    const user ={
       email: email,
       password: password
    }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: '30m'
    })
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
}

// TODO: move these refresh tokens to a database
let refreshTokens: string[] = []

export const token = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.body.token;
    if(!refreshToken) return res.status(401).json({ message: 'Unauthorized' });
    if(!refreshTokens.includes(refreshToken)) return res.status(403).json({ message: 'Forbidden' });
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).json({ message: 'Forbidden' });
        const accessToken = jwt.sign({
            email: user.email,
            password: user.password
        }, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '30m'
        })
        res.json({ accessToken: accessToken });
    })
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.status(204);
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                email,
                hashed_password: hashedPassword
            }
        });
        res.status(201).json({
            message: 'User created successfully',
            user: { id: newUser.id, email: newUser.email }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
}

    