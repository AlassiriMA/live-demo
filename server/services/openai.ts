import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

type ChatRole = "system" | "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatOptions {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key is not set. Chat functionality will not work properly.');
    }
    
    this.client = new OpenAI({ 
      apiKey: apiKey || 'dummy-key-for-initialization',
    });
  }

  /**
   * Generate a chat completion using OpenAI's API
   */
  async generateChatCompletion({
    messages,
    maxTokens = 500,
    temperature = 0.7
  }: ChatOptions): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      return this.getFallbackResponse();
    }

    try {
      const response = await this.client.chat.completions.create({
        model: MODEL,
        messages: messages,
        max_tokens: maxTokens,
        temperature: temperature,
      });

      return response.choices[0].message.content || "I'm not sure how to respond to that.";
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.getFallbackResponse(error);
    }
  }

  /**
   * Generate a marketing-focused response using a structured prompt
   */
  async generateMarketingResponse(userMessage: string): Promise<string> {
    const systemPrompt = `You are a helpful marketing assistant for a digital marketing agency. 
    Your agency offers the following services:
    - Search Engine Optimization (SEO)
    - Social Media Marketing
    - Content Marketing
    - Email Marketing
    - PPC Advertising
    - Web Design and Development
    
    Pricing starts at $999/month for small businesses and scales based on business size and needs.
    
    When responding to inquiries:
    - Be friendly, professional, and helpful
    - Provide specific information about services when asked
    - Explain the benefits of digital marketing
    - Encourage the user to schedule a consultation for detailed pricing
    - Keep responses concise (2-3 paragraphs maximum)
    
    If you don't know the answer to a specific question, suggest scheduling a call with a marketing specialist.`;

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ] as ChatMessage[];

    return await this.generateChatCompletion({
      messages,
      temperature: 0.7,
      maxTokens: 250
    });
  }

  /**
   * Provide a fallback response when the API is unavailable
   */
  private getFallbackResponse(error?: any): string {
    const fallbackResponses = [
      "I'm currently experiencing some technical difficulties. Could you please try again later or contact one of our marketing specialists?",
      "Thanks for your message! Our team would be happy to discuss your marketing needs in detail. Would you like to schedule a consultation?",
      "I'd love to help you with that question. Our marketing specialists would be able to provide more personalized information. Would you like their contact details?",
      "That's a great question about our services. To give you the most accurate information, I recommend scheduling a quick call with our team."
    ];
    
    if (error) {
      console.error('Using fallback response due to error:', error);
    }
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}

// Singleton instance
export const openaiService = new OpenAIService();