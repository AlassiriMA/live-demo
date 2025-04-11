import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, MessageSquare, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Define message types
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function CustomerServiceBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownInitialMessage, setHasShownInitialMessage] = useState(false);
  const [notificationCount, setNotificationCount] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Auto open chat after delay on first visit
  useEffect(() => {
    // Check if this is the first visit based on local storage
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('has_visited_portfolio');
      
      if (!hasVisited) {
        // Set a delay before showing the chat for first-time visitors
        const timer = setTimeout(() => {
          // Don't auto-open on mobile devices
          if (window.innerWidth >= 768) {
            setIsOpen(true);
            setHasShownInitialMessage(true);
          }
          localStorage.setItem('has_visited_portfolio', 'true');
        }, 8000); // 8 seconds delay
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Initial message from assistant
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I\'m your virtual assistant. How can I help you with our portfolio services today?',
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    
    try {
      // Call backend API for the chatbot response
      const response = await fetch('/api/chat/customer-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from virtual assistant');
      }
      
      const data = await response.json();
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      toast({
        title: 'Communication Error',
        description: 'Unable to reach the virtual assistant. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-70 blur-sm"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.9, 0.7]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <Button
          onClick={() => {
            setIsOpen(true);
            setNotificationCount(0);
          }}
          className="relative h-16 w-16 rounded-full shadow-xl bg-primary hover:bg-primary/90 transition-all"
          aria-label="Open customer service chat"
        >
          <MessageSquare className="h-8 w-8" />
          {notificationCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            >
              {notificationCount}
            </motion.span>
          )}
        </Button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-xl flex flex-col bg-white border border-gray-200 overflow-hidden backdrop-blur-sm"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
              <div className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Customer Service</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full text-primary-foreground hover:bg-primary-foreground/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-none' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center ml-2 flex-shrink-0 self-end mb-1">
                      <span className="text-xs font-semibold text-primary">You</span>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isThinking && (
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-200 flex items-center space-x-2">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex space-x-1.5"
                    >
                      <motion.span 
                        className="h-2.5 w-2.5 bg-primary/60 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "loop", times: [0, 0.5, 1], ease: "easeInOut" }}
                      />
                      <motion.span 
                        className="h-2.5 w-2.5 bg-primary/60 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "loop", delay: 0.2, times: [0, 0.5, 1], ease: "easeInOut" }}
                      />
                      <motion.span 
                        className="h-2.5 w-2.5 bg-primary/60 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "loop", delay: 0.4, times: [0, 0.5, 1], ease: "easeInOut" }}
                      />
                    </motion.div>
                    <span className="text-sm text-gray-500 font-medium">Portfolio Assistant is typing...</span>
                  </div>
                </motion.div>
              )}
              
              {/* Invisible element for auto-scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area with improved design */}
            <div className="p-4 border-t bg-white">
              <div className="text-xs text-gray-500 mb-2 flex items-center">
                <span className="bg-green-500 h-1.5 w-1.5 rounded-full mr-1.5"></span>
                <span>Portfolio Assistant is online</span>
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about our portfolio, projects, or services..."
                  className="flex-1 pr-12 py-3 pl-4 rounded-full shadow-sm border-gray-200 focus-visible:ring-1 focus-visible:ring-primary"
                  disabled={isThinking}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim()) handleSubmit(e);
                    }
                  }}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isThinking || !input.trim()}
                  className="absolute right-1 top-1 rounded-full h-8 w-8 bg-primary hover:bg-primary/90 transition-all"
                >
                  {isThinking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}