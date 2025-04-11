import { Router } from 'express';
import { z } from 'zod';
import { openaiService } from '../services/openai';

const router = Router();

// Schema for validating chat message requests
const chatMessageSchema = z.object({
  message: z.string().min(1).max(500),
});

/**
 * POST /api/chatbot/message
 * 
 * Processes a chat message and returns an AI-generated response
 * 
 * @body {message: string} - The user's message
 * @returns {message: string} - The AI-generated response
 */
router.post('/message', async (req, res) => {
  try {
    // Validate the request body
    const result = chatMessageSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body',
        details: result.error.format(),
      });
    }
    
    const { message } = result.data;
    
    // Generate a response using OpenAI
    const aiResponse = await openaiService.generateMarketingResponse(message);
    
    // Return the response
    return res.status(200).json({
      success: true,
      message: aiResponse,
    });
  } catch (error) {
    console.error('Error processing chatbot message:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to process message',
    });
  }
});

export default router;