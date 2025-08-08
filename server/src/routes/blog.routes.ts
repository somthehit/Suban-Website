import express from 'express';
import * as blogController from '../controllers/blogController';

const router = express.Router();

// Public routes
router.get('/blog', blogController.getBlogPosts);
router.get('/blog/:slug', blogController.getBlogPostBySlug);

// Admin routes
router.post('/admin/blog', blogController.createBlogPost);
router.get('/admin/blog/:id', blogController.getBlogPostById);
router.put('/admin/blog/:id', blogController.updateBlogPost);
router.delete('/admin/blog/:id', blogController.deleteBlogPost);

export default router;
