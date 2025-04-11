import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { openaiService } from '../services/openai';

const router = Router();

// Validate the chat message
const chatMessageSchema = z.object({
  message: z.string().min(1).max(500),
});

// Chat endpoint
router.post('/message', async (req: Request, res: Response) => {
  try {
    // Validate the request
    const validation = chatMessageSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request', 
        errors: validation.error.errors 
      });
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key is not set. Using fallback responses.');
      return res.status(200).json({
        success: true,
        message: "Thanks for your message! Our team would be happy to help you with your marketing needs. Would you like to schedule a consultation?",
        source: "fallback"
      });
    }

    // Get message from request
    const { message } = validation.data;

    // Generate a response using OpenAI
    const aiResponse = await openaiService.generateMarketingResponse(message);

    // Return the response
    return res.status(200).json({
      success: true,
      message: aiResponse,
      source: "ai"
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing your request' 
    });
  }
});

export default router;