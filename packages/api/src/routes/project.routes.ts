// Project routes
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All project routes require authentication
router.use(authMiddleware);

// GET /api/projects
router.get('/', (req, res) => {
  // TODO: List user projects
  res.status(501).json({ message: 'List projects endpoint - Coming soon' });
});

// POST /api/projects
router.post('/', (req, res) => {
  // TODO: Create new project
  res.status(501).json({ message: 'Create project endpoint - Coming soon' });
});

// GET /api/projects/:id
router.get('/:id', (req, res) => {
  // TODO: Get project by ID
  res.status(501).json({ message: 'Get project endpoint - Coming soon' });
});

// PATCH /api/projects/:id
router.patch('/:id', (req, res) => {
  // TODO: Update project
  res.status(501).json({ message: 'Update project endpoint - Coming soon' });
});

// DELETE /api/projects/:id
router.delete('/:id', (req, res) => {
  // TODO: Delete project
  res.status(501).json({ message: 'Delete project endpoint - Coming soon' });
});

export { router as projectRoutes };


