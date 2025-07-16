import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { createMessage, getRoomMessages } from '../controller/messageController.js';

//routes
const router = express.Router();

router.use(authMiddleware);
router.post('/', createMessage);
router.get('/:roomId', getRoomMessages);

export default router;



