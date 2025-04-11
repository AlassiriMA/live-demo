import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatbotProps {
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

// Pre-defined responses based on keywords
const botResponses: Record<string, string[]> = {
  default: [
    "Thank you for your message! How can I help you with digital marketing today?",
    "I'd be happy to help you with that. Could you tell me more about your business needs?",
    "Great question! Our marketing specialists can provide more detailed information.",
  ],
  pricing: [
    "Our pricing is customized based on your business needs. We offer packages starting from $999/month for small businesses.",
    "We have flexible pricing options that scale with your business. Would you like to schedule a consultation to discuss your specific needs?",
  ],
  seo: [
    "Our SEO services include keyword research, on-page optimization, technical SEO, and backlink building. On average, our clients see a 210% increase in organic traffic.",
    "We take a comprehensive approach to SEO, focusing on both technical and content optimization. Would you like to hear about our SEO success stories?",
  ],
  social: [
    "Our social media services include strategy development, content creation, community management, and paid advertising. We handle platforms like Facebook, Instagram, LinkedIn, Twitter, and TikTok.",
    "We've helped businesses increase their social media engagement by an average of 138%. Would you like to know more about our approach?",
  ],
  email: [
    "Our email marketing services include campaign strategy, design, automation, and analytics. We specialize in building sequences that convert.",
    "Our clients typically see open rates of 30%+ with our email marketing strategies. Would you like to learn how we can improve your email performance?",
  ],
  hello: [
    "Hello! Thanks for reaching out. How can I help you with your marketing needs today?",
    "Hi there! I'm here to answer any questions you have about our digital marketing services. What can I help you with?",
  ],
};

export default function Chatbot({ onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hi there! I'm your marketing assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    
    // Add typing indicator
    const typingId = 'typing-' + Date.now();
    setMessages((prev) => [...prev, {
      id: typingId,
      sender: "bot",
      text: "Thinking...",
      timestamp: new Date(),
    }]);
    
    try {
      // Get response from the AI
      const aiResponse = await getBotResponse(userInput.toLowerCase());
      
      // Remove typing indicator and add bot response
      setMessages((prev) => {
        const filtered = prev.filter(msg => msg.id !== typingId);
        return [...filtered, {
          id: Date.now().toString(),
          sender: "bot",
          text: aiResponse,
          timestamp: new Date(),
        }];
      });
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Remove typing indicator and add fallback response
      setMessages((prev) => {
        const filtered = prev.filter(msg => msg.id !== typingId);
        return [...filtered, {
          id: Date.now().toString(),
          sender: "bot",
          text: getRandomResponse("default"),
          timestamp: new Date(),
        }];
      });
    }
  };
  
  // Get a bot response using AI via API
  const getBotResponse = async (userInput: string): Promise<string> => {
    try {
      // Call the API
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Chatbot API error:', data);
        return getRandomResponse("default");
      }
      
      return data.message;
    } catch (error) {
      console.error('Chatbot API request failed:', error);
      return getRandomResponse("default");
    }
  };
  
  // Get a random response from the category (used as fallback)
  const getRandomResponse = (category: string): string => {
    const responses = botResponses[category] || botResponses.default;
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  // Handle input keypress (Enter)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed bottom-6 right-6 w-96 h-[500px] glass-bg rounded-xl shadow-xl overflow-hidden z-50"
    >
      <div className="flex flex-col h-full">
        {/* Chatbot header */}
        <div className="bg-gradient-to-r from-[#EC4899] to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="font-medium">Marketing Assistant</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Chat messages */}
        <ScrollArea className="flex-1 p-4 bg-white/70">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user" 
                      ? "bg-[#EC4899] text-white" 
                      : "bg-gray-200 text-gray-800"
                  }`}>
                    <p>{message.text}</p>
                    <div className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-pink-100" : "text-gray-500"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messageEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input area */}
        <div className="p-4 bg-white/90 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 focus:ring-[#EC4899] focus:border-[#EC4899]"
            />
            <Button 
              onClick={handleSendMessage} 
              className="bg-[#EC4899] hover:bg-[#DB2777] text-white px-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Ask about our marketing services, pricing, or success stories!
          </div>
        </div>
      </div>
    </motion.div>
  );
}
