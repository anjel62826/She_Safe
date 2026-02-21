const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  createBlog,
  getBlog,
  getAllBlogs,
  likeBlog,
  commentBlog,
  bookmarkBlog,
  getPopularDestinations
} = require('../controllers/blogController');

router.get('/', getAllBlogs);
router.get('/destinations/popular', getPopularDestinations);
router.get('/:blogId', getBlog);

// Protected routes
router.use(authMiddleware);
router.post('/', createBlog);
router.post('/:blogId/like', likeBlog);
router.post('/:blogId/comment', commentBlog);
router.post('/:blogId/bookmark', bookmarkBlog);

module.exports = router;
