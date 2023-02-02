import express from 'express';
import { createChat, findChat, userChats } from '../controllers/ChatController.js';
import { verifyToken } from '../middleware/Auth.js';

const router = express.Router();

router.post('/', createChat);
router.get('/:userId', verifyToken, userChats);
router.get('/find/:firstId/:secondId',verifyToken, findChat);

export default router;
