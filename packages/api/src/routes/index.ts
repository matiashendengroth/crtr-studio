// CRTR Studio API - Main Router
import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { projectRoutes } from './project.routes';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'CRTR Studio API',
    version: '0.1.0',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects'
    }
  });
});

export { router as routes };



