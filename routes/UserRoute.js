import express from 'express';

import {
  getUserProfile,
  getFriendList,
  addRemoveFriends,
  updateUserProfile,
  searchUser
} from '../controllers/UserController.js';

import { verifyToken } from '../middleware/Auth.js';

const router = express.Router();

/* READ */
router.get('/:id', verifyToken, getUserProfile);
router.get('/:id/friends', verifyToken, getFriendList);
router.get('/search/user/:search', searchUser);

/* UPDATE */
router.patch('/:id/:friendId', addRemoveFriends);

router.put('/edit-user/:id', updateUserProfile);

export default router;
