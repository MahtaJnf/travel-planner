import express from 'express';
import { login, token, logout, register } from '../controllers/authController';

const router = express.Router();

router.route('/login').post(login);
router.route('/token').post(token);
router.route('/logout').delete(logout);
router.route('/register').post(register);


export default router;
