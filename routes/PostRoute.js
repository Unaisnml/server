import express from 'express';
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  commentPost,
  getPostForDelete,
  deletePost
} from '../controllers/PostController.js';
import { verifyToken } from '../middleware/Auth.js';

const router = express.Router();

/* READ */
router.get('/', getFeedPosts);
router.get('/:userId/posts', verifyToken, getUserPosts);
router.get('/postId-for-delete', getPostForDelete);

/* UPDATE */
router.patch('/:id/like', verifyToken, likePost);

/* COMMENT */
router.patch('/comment', commentPost);

router.post('/post-delete', deletePost);

export default router;
