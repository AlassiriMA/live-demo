import React from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Bookmark, ThumbsUp, MessageSquare } from 'lucide-react';
import AppShell from "@/components/layout/AppShell";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

// Mock blog data - this would come from an API or database in a real app
const blogPosts = [
  {
    id: 1,
    title: "How to Build a Trading Bot in 30 Minutes",
    excerpt: "In this tutorial, we'll explore how to quickly build a simple trading bot that can analyze market data and execute trades based on predefined strategies.",
    date: "April 5, 2025",
    category: "Development",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: {
      name: "Mohammad Alassiri",
      avatar: "",
      bio: "Full-stack developer with a passion for algorithmic trading and financial markets."
    },
    content: `
      <h2>Introduction</h2>
      <p>Algorithmic trading has become increasingly accessible to individual developers and traders. With the right tools and knowledge, you can create a simple but effective trading bot in just 30 minutes. In this tutorial, we'll walk through the basics of setting up a trading bot that can analyze market data and execute trades based on predefined strategies.</p>
      
      <h2>Prerequisites</h2>
      <p>Before we dive into the code, make sure you have the following:</p>
      <ul>
        <li>Basic knowledge of JavaScript/Node.js</li>
        <li>An account with a cryptocurrency exchange that offers an API</li>
        <li>Node.js installed on your computer</li>
      </ul>
      
      <h2>Setting Up Your Environment</h2>
      <p>First, let's create a new Node.js project and install the necessary dependencies:</p>
      
      <pre><code>mkdir trading-bot
cd trading-bot
npm init -y
npm install ccxt dotenv</code></pre>
      
      <p>CCXT is a fantastic library that provides a unified API for interacting with many different cryptocurrency exchanges. It will save us a lot of time and allow our bot to work with multiple exchanges.</p>
      
      <h2>Creating the Basic Bot Structure</h2>
      <p>Let's start by creating a basic structure for our trading bot. Create a file called <code>bot.js</code> with the following content:</p>
      
      <pre><code>const ccxt = require('ccxt');
require('dotenv').config();

class TradingBot {
  constructor(exchange, symbol, strategy) {
    this.exchange = exchange;
    this.symbol = symbol;
    this.strategy = strategy;
  }
  
  async initialize() {
    this.exchangeInstance = new ccxt[this.exchange]({
      apiKey: process.env.API_KEY,
      secret: process.env.API_SECRET
    });
    
    await this.exchangeInstance.loadMarkets();
    console.log(\`Trading bot initialized for \${this.symbol} on \${this.exchange}\`);
  }
  
  async fetchMarketData() {
    const ticker = await this.exchangeInstance.fetchTicker(this.symbol);
    const orderBook = await this.exchangeInstance.fetchOrderBook(this.symbol);
    return { ticker, orderBook };
  }
  
  async executeStrategy() {
    const marketData = await this.fetchMarketData();
    const signal = this.strategy(marketData);
    
    if (signal === 'buy') {
      // Execute buy order
      console.log('Buy signal detected - executing order');
      // In a real implementation, you would add code to execute an actual order here
    } else if (signal === 'sell') {
      // Execute sell order
      console.log('Sell signal detected - executing order');
      // In a real implementation, you would add code to execute an actual order here
    } else {
      console.log('No trading signal detected');
    }
  }
  
  async run() {
    await this.initialize();
    
    // Run the strategy every minute
    setInterval(async () => {
      try {
        await this.executeStrategy();
      } catch (error) {
        console.error('Error executing strategy:', error);
      }
    }, 60000);
  }
}

module.exports = TradingBot;</code></pre>
      
      <h2>Implementing a Simple Trading Strategy</h2>
      <p>Now, let's implement a simple moving average crossover strategy. Create a file called <code>strategy.js</code>:</p>
      
      <pre><code>function simpleMovingAverageCrossover(marketData) {
  // In a real application, you would calculate short and long-term moving averages
  // from historical price data. For simplicity, we'll use a placeholder implementation.
  
  const { ticker } = marketData;
  const currentPrice = ticker.last;
  
  // Placeholder for actual moving average calculations
  // In a real app, you'd fetch historical data and calculate these values
  const shortTermMA = currentPrice * 0.99; // Simulated short-term MA slightly below current price
  const longTermMA = currentPrice * 0.98;  // Simulated long-term MA further below current price
  
  // Generate buy signal when short-term MA crosses above long-term MA
  if (shortTermMA > longTermMA) {
    return 'buy';
  }
  // Generate sell signal when short-term MA crosses below long-term MA
  else if (shortTermMA < longTermMA) {
    return 'sell';
  }
  
  // No signal
  return 'hold';
}

module.exports = simpleMovingAverageCrossover;</code></pre>
      
      <h2>Creating the Main Application</h2>
      <p>Finally, let's create our main application file <code>index.js</code> to tie everything together:</p>
      
      <pre><code>const TradingBot = require('./bot');
const simpleMovingAverageCrossover = require('./strategy');

// Create and run the trading bot
const bot = new TradingBot('binance', 'BTC/USDT', simpleMovingAverageCrossover);
bot.run()
  .catch(error => console.error('Bot error:', error));</code></pre>
      
      <h2>Configuration</h2>
      <p>Create a <code>.env</code> file in your project root to store your API credentials:</p>
      
      <pre><code>API_KEY=your_api_key_here
API_SECRET=your_api_secret_here</code></pre>
      
      <p>Make sure to replace the placeholders with your actual API key and secret from your exchange account.</p>
      
      <h2>Running Your Bot</h2>
      <p>Now you can run your trading bot with:</p>
      
      <pre><code>node index.js</code></pre>
      
      <h2>Important Considerations</h2>
      <p>Before deploying any trading bot with real money, consider the following:</p>
      <ul>
        <li>Start with paper trading (simulated trading without real money) to test your strategy</li>
        <li>Implement proper risk management (stop losses, position sizing)</li>
        <li>Add error handling and logging to monitor your bot's performance</li>
        <li>Ensure your strategy has been thoroughly backtested with historical data</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Congratulations! You've built a basic trading bot in less than 30 minutes. While this is a simplified example, it provides a foundation that you can expand upon to create more sophisticated trading strategies.</p>
      
      <p>In future tutorials, we'll explore more advanced topics such as backtesting, implementing multiple indicators, and optimizing strategies for different market conditions.</p>
    `,
    tags: ["Trading Bot", "Node.js", "Cryptocurrency", "JavaScript", "Algorithmic Trading"],
    relatedPosts: [2, 4, 5]
  },
  {
    id: 2,
    title: "The Future of E-commerce: Trends in Tech",
    excerpt: "Explore the emerging technologies that are reshaping the e-commerce landscape and how businesses can leverage them to create better shopping experiences.",
    date: "March 22, 2025",
    category: "Business",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: {
      name: "Mohammad Alassiri",
      avatar: "",
      bio: "Full-stack developer and e-commerce consultant."
    },
    content: "<p>This is a placeholder for the full article content.</p>",
    tags: ["E-commerce", "Business Technology", "Retail Tech", "Digital Transformation"],
    relatedPosts: [3, 6]
  },
  {
    id: 3,
    title: "Designing for UX: Neumorphism in Practice",
    excerpt: "A deep dive into the neumorphic design trend and how to implement it in your applications while maintaining accessibility and usability.",
    date: "March 10, 2025",
    category: "Design",
    readTime: "10 min read",
    imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: {
      name: "Mohammad Alassiri",
      avatar: "",
      bio: "UI/UX designer and frontend developer with a focus on accessible design."
    },
    content: "<p>This is a placeholder for the full article content.</p>",
    tags: ["UI Design", "UX", "Neumorphism", "Accessibility", "CSS"],
    relatedPosts: [6]
  },
  {
    id: 4,
    title: "Building Real-time Dashboards with React and WebSockets",
    excerpt: "Learn how to create dynamic, real-time dashboards that automatically update as new data becomes available using React and WebSockets.",
    date: "February 28, 2025",
    category: "Development",
    readTime: "12 min read",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: {
      name: "Mohammad Alassiri",
      avatar: "",
      bio: "Full-stack developer specializing in real-time web applications."
    },
    content: "<p>This is a placeholder for the full article content.</p>",
    tags: ["React", "WebSockets", "Dashboards", "Real-time", "JavaScript"],
    relatedPosts: [1, 5]
  },
  {
    id: 5,
    title: "PostgreSQL Performance Optimization Techniques",
    excerpt: "A comprehensive guide to improving your PostgreSQL database performance through indexing, query optimization, and proper schema design.",
    date: "February 15, 2025",
    category: "Database",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: {
      name: "Mohammad Alassiri",
      avatar: "",
      bio: "Database engineer and backend developer with extensive experience in PostgreSQL."
    },
    content: "<p>This is a placeholder for the full article content.</p>",
    tags: ["PostgreSQL", "Database", "Performance Optimization", "SQL"],
    relatedPosts: [4]
  },
  {
    id: 6,
    title: "The Psychology of Effective UI Design",
    excerpt: "Explore how understanding human psychology can help you create more intuitive and engaging user interfaces that drive conversion and satisfaction.",
    date: "January 30, 2025",
    category: "Design",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1534670007418-bc0cecc80c1b?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: {
      name: "Mohammad Alassiri",
      avatar: "",
      bio: "UI/UX designer with a background in cognitive psychology."
    },
    content: "<p>This is a placeholder for the full article content.</p>",
    tags: ["UI Design", "Psychology", "UX", "Conversion Optimization"],
    relatedPosts: [3]
  }
];

// Category colors
const categoryColors: Record<string, { bg: string, text: string }> = {
  Development: { bg: "bg-blue-100", text: "text-blue-700" },
  Business: { bg: "bg-purple-100", text: "text-purple-700" },
  Design: { bg: "bg-pink-100", text: "text-pink-700" },
  Database: { bg: "bg-green-100", text: "text-green-700" },
};

const BlogPostDetail = () => {
  const [, params] = useRoute('/blog/:id');
  const blogId = parseInt(params?.id || '0');
  
  // Find the blog post by ID
  const post = blogPosts.find(post => post.id === blogId);
  
  // Find related posts
  const relatedPosts = post?.relatedPosts
    ? blogPosts.filter(p => post.relatedPosts.includes(p.id))
    : [];
    
  if (!post) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="mb-6">Sorry, the blog post you're looking for does not exist.</p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
          
          {/* Post header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryColors[post.category].bg} ${categoryColors[post.category].text} mb-4`}>
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">{post.title}</h1>
              
              <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readTime}</span>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{post.tags[0]}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Hero image */}
            <div className="mb-8 rounded-xl overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Author info and share */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  {post.author.avatar && <AvatarImage src={post.author.avatar} />}
                </Avatar>
                <div>
                  <p className="font-medium text-gray-800">{post.author.name}</p>
                  <p className="text-sm text-gray-500">{post.author.bio}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Post content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-between items-center mb-12 py-6 border-t border-b">
            <Button variant="outline" className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              Like this article
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Leave a comment
            </Button>
          </div>
          
          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map(related => (
                  <Card key={related.id} className="overflow-hidden h-full flex flex-col">
                    <div className="h-40 relative overflow-hidden">
                      <img 
                        src={related.imageUrl} 
                        alt={related.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[related.category].bg} ${categoryColors[related.category].text}`}>
                          {related.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-center text-xs text-gray-500 space-x-3 mb-2">
                        <span>{related.date}</span>
                        <span>•</span>
                        <span>{related.readTime}</span>
                      </div>
                      
                      <h3 className="text-base font-bold mb-2 line-clamp-2">
                        <Link href={`/blog/${related.id}`} className="hover:text-primary transition-colors">
                          {related.title}
                        </Link>
                      </h3>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                        {related.excerpt}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default BlogPostDetail;