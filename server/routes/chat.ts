import { Router } from 'express';
import OpenAI from 'openai';
import { z, ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

// For production deployment - environment variable check
if (process.env.NODE_ENV === 'production' && !process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set. Customer service chatbot will use fallback mode.');
}

const router = Router();

// Validate the chat message schema
const chatMessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  }))
});

// Pre-defined responses for common queries
const predefinedResponses = {
  greeting: "Hello! I'm Portfolio Assistant. How can I help you with our portfolio services today?",
  projects: "Our portfolio showcases 10 diverse projects including a POS System, Fruit Store, Marketing Agency, BI Dashboard, and several financial tools. Would you like more details about any specific project?",
  services: "We offer web development, backend development, UI/UX design, AI integration, mobile development, code consultation, digital innovation, and security audits. Each service is tailored to meet your specific needs.",
  skills: "Our developer specializes in React, TypeScript, Node.js, Express, PostgreSQL, and AI integration. The portfolio demonstrates expertise in full-stack development with a focus on modern, scalable solutions.",
  contact: "You can reach our developer at me@alassiri.nl or call +316 10979730. We're based in Amsterdam, Netherlands and always open to discussing new projects and opportunities.",
  default: "Thank you for your message. I'd be happy to provide more information about our portfolio, projects, or services. Could you please be more specific about what you're looking for?"
};

// Keyword matching function
function getResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.match(/^(good|afternoon|morning|evening)/)) {
    return predefinedResponses.greeting;
  } 
  
  if (message.includes('project') || message.includes('portfolio') || message.includes('showcase') || message.includes('demo')) {
    return predefinedResponses.projects;
  }
  
  if (message.includes('service') || message.includes('offer') || message.includes('provide') || message.includes('do you')) {
    return predefinedResponses.services;
  }
  
  if (message.includes('skill') || message.includes('tech') || message.includes('technology') || message.includes('experience') || message.includes('expertise')) {
    return predefinedResponses.skills;
  }
  
  if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('call') || message.includes('reach')) {
    return predefinedResponses.contact;
  }
  
  // Project-specific responses
  if (message.includes('pos') || message.includes('bookstore')) {
    return "Our POS System for bookstores features inventory management, sales tracking, and customer management. It's built with React, Express, and PostgreSQL, demonstrating practical retail software implementation.";
  }
  
  if (message.includes('fruit') || message.includes('store') || message.includes('ecommerce')) {
    return "The Fruit Store is an e-commerce platform offering fresh fruits with real-time inventory, secure checkout, and order tracking. It showcases modern e-commerce development practices.";
  }
  
  if (message.includes('market') || message.includes('agency')) {
    return "Our Marketing Agency website features service showcases, lead generation forms, and an AI chatbot assistant to engage visitors. It demonstrates effective digital presence creation.";
  }
  
  if (message.includes('bi') || message.includes('dashboard') || message.includes('intelligence')) {
    return "The Business Intelligence Dashboard offers interactive data visualization and analytics tools. It demonstrates data processing and visualization capabilities for informed business decisions.";
  }
  
  if (message.includes('english') || message.includes('tutor') || message.includes('ai') || message.includes('language')) {
    return "The English AI Tutor provides personalized language learning with speech recognition, grammar correction, and vocabulary building. It showcases practical AI application in education.";
  }
  
  return predefinedResponses.default;
}

// Conditional OpenAI client initialization
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log('OpenAI client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
    openai = null;
  }
}

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

Information about the developer:
- Location: Amsterdam, Netherlands
- Email: me@alassiri.nl
- Phone: +316 10979730
- Primary skills: React, TypeScript, Node.js, Express, PostgreSQL, AI integration

Keep your responses concise (under 100 words) unless detailed information is specifically requested.
`;

// Customer service chat endpoint - tries OpenAI first, falls back to local processing if unavailable
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
    
    // Try to use OpenAI if available
    if (openai && process.env.NODE_ENV === 'production') {
      try {
        console.log('Using OpenAI for chat response');
        
        // Prepend system message to provide context
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

        return res.json({
          success: true,
          message: assistantMessage
        });
      } catch (error) {
        console.warn('OpenAI API error, falling back to local responses:', error);
        // Continue with fallback method
      }
    }
    
    // Fallback to local processing
    console.log('Using local responses for chat');
    const lastUserMessage = messages
      .filter(msg => msg.role === 'user')
      .pop()?.content || '';
    
    // Generate response using the local function
    const assistantMessage = getResponse(lastUserMessage);
    
    // Add a slight delay to simulate "thinking" (250-750ms)
    setTimeout(() => {
      res.json({
        success: true,
        message: assistantMessage
      });
    }, Math.random() * 500 + 250);
  } catch (error) {
    console.error('Error in customer service chat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat request'
    });
  }
});

export default router;