import { Router, Response } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { db } from '../db';
import { auth, AuthRequest, adminOnly } from '../middleware/auth';
import { insertProjectSchema, updateProjectSchema } from '@shared/schema';

const router = Router();

// Extend schemas with validation
const createProjectSchema = insertProjectSchema.extend({
  slug: z.string().min(3).refine(s => /^[a-z0-9-]+$/.test(s), {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens'
  }),
  name: z.string().min(2).max(255),
  description: z.string().min(10),
  tags: z.array(z.string()).optional().transform(tags => 
    tags ? tags.join(',') : null
  ),
  features: z.array(z.object({
    title: z.string(),
    description: z.string()
  })).optional()
});

// Get all projects (admin)
router.get('/', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const projects = await storage.getAllProjects();
    return res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get published projects (public)
router.get('/published', async (req: AuthRequest, res: Response) => {
  try {
    const projects = await storage.getPublishedProjects();
    return res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error('Get published projects error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get project by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const project = await storage.getProjectById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // If project is not published and user is not admin, return 404
    if (!project.published && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json({ success: true, project });
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get project by slug
router.get('/slug/:slug', async (req: AuthRequest, res: Response) => {
  try {
    const slug = req.params.slug;
    
    // First try to get project using ORM
    try {
      const project = await storage.getProjectBySlug(slug);
      if (project) {
        // If project is not published and user is not admin, return 404
        if (!project.published && (!req.user || req.user.role !== 'admin')) {
          return res.status(404).json({ message: 'Project not found' });
        }
        return res.status(200).json({ success: true, project });
      }
    } catch (ormError) {
      console.error('ORM fetch error:', ormError);
    }
    
    // If ORM fails, try direct SQL
    try {
      const result = await db.query.projects.findFirst({
        where: (projects, { eq, and }) => 
          and(eq(projects.slug, slug), eq(projects.published, true))
      });
      
      if (result) {
        // The ORM query returns the project with camelCase field names already
        const project = result;
        
        return res.status(200).json({ success: true, project });
      }
    } catch (sqlError) {
      console.error('SQL fetch error:', sqlError);
    }
    
    // If no project found via any method, return 404
    return res.status(404).json({ message: 'Project not found' });
  } catch (error) {
    console.error('Get project by slug error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create project (admin only)
router.post('/', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    // Validate request
    const validation = createProjectSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    // Check if slug is already used
    const existingProject = await storage.getProjectBySlug(validation.data.slug);
    if (existingProject) {
      return res.status(400).json({ message: 'Slug already in use' });
    }

    // Create project
    const project = await storage.createProject(validation.data);

    // Log activity
    await storage.createActivityLog({
      userId: req.user!.id,
      action: 'create',
      entityType: 'project',
      entityId: project.id,
      details: { name: project.name, slug: project.slug }
    });

    return res.status(201).json({ success: true, project });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update project (admin only)
router.patch('/:id', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Process tags if they're in array format
    if (req.body.tags && Array.isArray(req.body.tags)) {
      req.body.tags = req.body.tags.join(',');
    }

    // Validate request
    const validation = updateProjectSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    // Check if project exists
    const existingProject = await storage.getProjectById(id);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update project
    const updatedProject = await storage.updateProject(id, validation.data);
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Log activity
    await storage.createActivityLog({
      userId: req.user!.id,
      action: 'update',
      entityType: 'project',
      entityId: updatedProject.id,
      details: { name: updatedProject.name, slug: updatedProject.slug, changes: Object.keys(validation.data) }
    });

    return res.status(200).json({ success: true, project: updatedProject });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete project (admin only)
router.delete('/:id', auth, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Check if project exists
    const existingProject = await storage.getProjectById(id);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete project
    const deleted = await storage.deleteProject(id);
    if (!deleted) {
      return res.status(500).json({ message: 'Failed to delete project' });
    }

    // Log activity
    await storage.createActivityLog({
      userId: req.user!.id,
      action: 'delete',
      entityType: 'project',
      entityId: id,
      details: { name: existingProject.name, slug: existingProject.slug }
    });

    return res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;