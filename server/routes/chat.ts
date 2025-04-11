import { Router } from 'express';
import OpenAI from 'openai';
import { z, ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

const router = Router();

// Validate the chat message schema
const chatMessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  }))
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Customer service training context
const systemPrompt = `
You are a customer service assistant for a professional portfolio website showcasing various web applications.
Your name is "Portfolio Assistant".

The portfolio includes the following applications:
1. POS System (Bookstore): A point-of-sale system for bookstores with inventory management
2. Fruit Store: An e-commerce platform for ordering fresh fruits
3. Marketing Agency: A website for a digital marketing agency with AI chatbot assistance
4. Business Intelligence Dashboard: Interactive data visualization and analytics
5. Statistical Arbitrage Tool: Trading tool for statistical arbitrage strategies
6. Triangular Arbitrage Scanner: Tool for detecting cryptocurrency arbitrage opportunities
7. dYdX Trading Interface: Interface for trading on the dYdX decentralized exchange
8. English AI Tutor: AI-powered English language teaching assistant
9. Beauty & Hair Salon: Website for a beauty salon with appointment booking
10. ThreadVerse (Reddit Clone): Social media platform similar to Reddit

Your goal is to:
- Provide helpful information about the portfolio and its applications
- Answer questions about the developer's skills and expertise
- Assist with inquiries about potential collaborations or job opportunities
- Direct users to the appropriate application based on their needs
- Be friendly, professional, and concise in your responses

Information about the developer:
- Name: Developer (not specified further for privacy)
- Location: Amsterdam, Netherlands
- Email: me@alassiri.nl
- Phone: +316 10979730
- GitHub: https://github.com/developerProfile
- Primary skills: React, TypeScript, Node.js, Express, PostgreSQL, AI integration

DO NOT:
- Make up information not provided above
- Share personal opinions or biased views
- Provide technical support for issues unrelated to the portfolio
- Engage in discussions about sensitive topics

Keep your responses concise (under 100 words) unless detailed information is specifically requested.
`;

// Customer service chat endpoint
router.post('/customer-service', async (req, res) => {
  try {
    const validation = chatMessageSchema.safeParse(req.body);
    
    if (!validation.success) {
      const validationError = fromZodError(validation.error);
      return res.status(400).json({ 
        success: false, 
        message: validationError.message 
      });
    }

    const { messages } = validation.data;

    // Prepend system message to provide context
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Properly type the messages for OpenAI API
    const typedMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: typedMessages,
      temperature: 0.7,
      max_tokens: 500
    });

    const assistantMessage = response.choices[0].message.content;

    res.json({
      success: true,
      message: assistantMessage
    });
  } catch (error) {
    console.error('Error in customer service chat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat request'
    });
  }
});

export default router;