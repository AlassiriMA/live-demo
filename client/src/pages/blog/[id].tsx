import { useEffect, useRef } from 'react';
import { useRoute, Link } from 'wouter';
import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, Share2, Bookmark, Heart, MessageCircle, Facebook, Twitter, Linkedin } from 'lucide-react';
import gsap from 'gsap';

// Import blog post data (using the mock data from blog.tsx)
const blogPosts = [
  {
    id: 1,
    title: "How to Build a Trading Bot in 30 Minutes",
    excerpt: "In this tutorial, we'll explore how to quickly build a simple trading bot that can analyze market data and execute trades based on predefined strategies.",
    date: "April 5, 2025",
    category: "Development",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Mohammad Alassiri",
    authorImageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: `
      <h2>Introduction to Trading Bots</h2>
      <p>Automated trading bots have revolutionized the way traders interact with financial markets. By leveraging algorithms and data analysis, these bots can execute trades faster and more efficiently than human traders.</p>
      
      <p>In this tutorial, we'll build a simple trading bot using Node.js and a few key libraries. Our bot will analyze price movements of a specific asset and make trading decisions based on a moving average crossover strategy—a classic method used by many traders.</p>
      
      <h2>Prerequisites</h2>
      <ul>
        <li>Basic knowledge of JavaScript and Node.js</li>
        <li>Understanding of trading concepts (helpful but not required)</li>
        <li>A cryptocurrency exchange account (we'll use a simulated one for this tutorial)</li>
      </ul>
      
      <h2>Setting Up Your Environment</h2>
      <p>First, let's create a new Node.js project and install the necessary dependencies:</p>
      
      <pre><code>
      mkdir trading-bot
      cd trading-bot
      npm init -y
      npm install ccxt dotenv technicalindicators
      </code></pre>
      
      <p>We're using these libraries:</p>
      <ul>
        <li><strong>ccxt</strong>: A cryptocurrency trading API with support for many exchanges</li>
        <li><strong>dotenv</strong>: For loading environment variables from a .env file</li>
        <li><strong>technicalindicators</strong>: A library that provides various technical indicators for market analysis</li>
      </ul>
      
      <h2>Implementing the Trading Strategy</h2>
      <p>Let's implement a simple moving average crossover strategy. This strategy generates a buy signal when a shorter-term moving average crosses above a longer-term moving average, and a sell signal when it crosses below.</p>
      
      <pre><code>
      // bot.js
      const ccxt = require('ccxt');
      const { SMA } = require('technicalindicators');
      require('dotenv').config();
      
      // Exchange configuration
      const exchange = new ccxt.binance({
        apiKey: process.env.API_KEY,
        secret: process.env.API_SECRET,
        // Use the test environment
        options: {
          createMarketBuyOrderRequiresPrice: false,
        }
      });
      
      // Trading parameters
      const symbol = 'BTC/USDT';
      const timeframe = '15m';
      const shortPeriod = 9;
      const longPeriod = 21;
      
      async function fetchCandles() {
        try {
          const candles = await exchange.fetchOHLCV(symbol, timeframe);
          return candles.map(candle => ({
            timestamp: candle[0],
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
            volume: candle[5]
          }));
        } catch (error) {
          console.error('Error fetching candles:', error);
          return [];
        }
      }
      
      function calculateIndicators(candles) {
        const closes = candles.map(candle => candle.close);
        
        const shortSMA = SMA.calculate({
          period: shortPeriod,
          values: closes
        });
        
        const longSMA = SMA.calculate({
          period: longPeriod,
          values: closes
        });
        
        // Add padding to match array lengths
        const padding = longPeriod - shortPeriod;
        const paddedShortSMA = Array(padding).fill(null).concat(shortSMA);
        
        return {
          shortSMA: paddedShortSMA,
          longSMA
        };
      }
      
      async function executeStrategy() {
        const candles = await fetchCandles();
        if (candles.length < longPeriod) {
          console.log('Not enough data to calculate indicators');
          return;
        }
        
        const { shortSMA, longSMA } = calculateIndicators(candles);
        
        // Get the two most recent values
        const currentShortSMA = shortSMA[shortSMA.length - 1];
        const previousShortSMA = shortSMA[shortSMA.length - 2];
        const currentLongSMA = longSMA[longSMA.length - 1];
        const previousLongSMA = longSMA[longSMA.length - 2];
        
        // Check for crossover
        const bullishCrossover = previousShortSMA <= previousLongSMA && currentShortSMA > currentLongSMA;
        const bearishCrossover = previousShortSMA >= previousLongSMA && currentShortSMA < currentLongSMA;
        
        if (bullishCrossover) {
          console.log('Buy signal!');
          // Implement buy logic here
        } else if (bearishCrossover) {
          console.log('Sell signal!');
          // Implement sell logic here
        } else {
          console.log('No trading signal');
        }
      }
      
      // Run the strategy
      setInterval(executeStrategy, 60000); // Run every minute
      executeStrategy(); // Run immediately on start
      </code></pre>
      
      <h2>Adding Risk Management</h2>
      <p>Real trading bots should include risk management features like stop-loss orders and position sizing. Here's a simple implementation:</p>
      
      <pre><code>
      async function executeOrder(side, price) {
        try {
          // Calculate position size (1% of account balance)
          const balance = await exchange.fetchBalance();
          const usdtBalance = balance.free.USDT;
          const positionSize = usdtBalance * 0.01;
          
          // Calculate quantity based on current price
          const quantity = positionSize / price;
          
          // Place market order
          const order = await exchange.createOrder(symbol, 'market', side, quantity);
          console.log(side + ' order executed:', order);
          
          // Place stop-loss order (5% below purchase price for buy, 5% above for sell)
          const stopLossPrice = side === 'buy' ? price * 0.95 : price * 1.05;
          const stopLossOrder = await exchange.createOrder(
            symbol,
            'stop',
            side === 'buy' ? 'sell' : 'buy',
            quantity,
            undefined,
            { stopPrice: stopLossPrice }
          );
          
          console.log('Stop-loss order placed:', stopLossOrder);
        } catch (error) {
          console.error('Error executing order:', error);
        }
      }
      </code></pre>
      
      <h2>Testing Your Bot</h2>
      <p>Before running your bot with real money, it's crucial to backtest it on historical data and then run it in a paper trading environment. Here's how you might set up a simple backtesting function:</p>
      
      <pre><code>
      async function backtest(days = 30) {
        // Fetch historical data
        const now = exchange.milliseconds();
        const since = now - (days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
        
        const allCandles = await exchange.fetchOHLCV(symbol, timeframe, since);
        const formattedCandles = allCandles.map(candle => ({
          timestamp: candle[0],
          open: candle[1],
          high: candle[2],
          low: candle[3],
          close: candle[4],
          volume: candle[5]
        }));
        
        let inPosition = false;
        let entryPrice = 0;
        let trades = [];
        let profit = 0;
        
        // Simulate trading on each candle
        for (let i = longPeriod; i < formattedCandles.length; i++) {
          const windowCandles = formattedCandles.slice(0, i + 1);
          const { shortSMA, longSMA } = calculateIndicators(windowCandles);
          
          const currentShortSMA = shortSMA[shortSMA.length - 1];
          const previousShortSMA = shortSMA[shortSMA.length - 2];
          const currentLongSMA = longSMA[longSMA.length - 1];
          const previousLongSMA = longSMA[longSMA.length - 2];
          
          const bullishCrossover = previousShortSMA <= previousLongSMA && currentShortSMA > currentLongSMA;
          const bearishCrossover = previousShortSMA >= previousLongSMA && currentShortSMA < currentLongSMA;
          
          const currentPrice = formattedCandles[i].close;
          
          if (!inPosition && bullishCrossover) {
            // Buy
            inPosition = true;
            entryPrice = currentPrice;
            trades.push({
              type: 'buy',
              price: currentPrice,
              timestamp: formattedCandles[i].timestamp
            });
          } else if (inPosition && bearishCrossover) {
            // Sell
            inPosition = false;
            const tradeProfit = ((currentPrice - entryPrice) / entryPrice) * 100;
            profit += tradeProfit;
            trades.push({
              type: 'sell',
              price: currentPrice,
              timestamp: formattedCandles[i].timestamp,
              profit: tradeProfit.toFixed(2) + '%'
            });
          }
        }
        
        console.log('Backtest results:');
        console.log('Total trades:', trades.length);
        console.log('Total profit:', profit.toFixed(2) + '%');
        console.log('Trade history:', trades);
      }
      
      // Run the backtest
      backtest();
      </code></pre>
      
      <h2>Conclusion</h2>
      <p>Building a basic trading bot is relatively simple, but creating a profitable one requires extensive testing, optimization, and risk management. This tutorial has given you the foundation to start experimenting with algorithmic trading.</p>
      
      <p>Remember that trading involves risk, and past performance is not indicative of future results. Always start with small amounts and never invest money you cannot afford to lose.</p>
      
      <p>For your next steps, consider:</p>
      <ul>
        <li>Implementing different trading strategies (e.g., RSI, MACD)</li>
        <li>Adding more sophisticated risk management</li>
        <li>Creating a web interface to monitor your bot's performance</li>
        <li>Running your bot on a cloud server for 24/7 operation</li>
      </ul>
    `,
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
    author: "Mohammad Alassiri",
    // Short content for demo purposes
    content: '<p>Coming soon...</p>'
  }
];

// Category colors
const categoryColors: Record<string, { bg: string, text: string }> = {
  Development: { bg: "bg-blue-100", text: "text-blue-700" },
  Business: { bg: "bg-purple-100", text: "text-purple-700" },
  Design: { bg: "bg-pink-100", text: "text-pink-700" },
  Database: { bg: "bg-green-100", text: "text-green-700" },
};

export default function BlogPost() {
  const [, params] = useRoute('/blog/:id');
  const postId = params?.id ? parseInt(params.id) : 1;
  const post = blogPosts.find(post => post.id === postId) || blogPosts[0];
  
  const { scrollYProgress } = useScroll();
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animate content elements
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h2');
      const paragraphs = contentRef.current.querySelectorAll('p');
      const codeBlocks = contentRef.current.querySelectorAll('pre');
      
      gsap.from(headings, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });
      
      gsap.from(paragraphs, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
      
      gsap.from(codeBlocks, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power2.out",
      });
    }
  }, [post.id]);
  
  const relatedPostsData = post.relatedPosts ? 
    blogPosts.filter(relPost => post.relatedPosts?.includes(relPost.id)).slice(0, 3) : [];

  return (
    <AppShell>
      {/* Reading progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 z-50 origin-left"
        style={{ width: progressBarWidth }}
      />
      
      {/* Hero section */}
      <div ref={heroRef} className="relative w-full h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="absolute w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${categoryColors[post.category].bg} ${categoryColors[post.category].text}`}>
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
            
            <div className="flex items-center text-white/90 space-x-4 mb-2">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
            
            <div className="flex items-center mt-6">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img 
                  src={post.authorImageUrl || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5'} 
                  alt={post.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-white">{post.author}</p>
                <p className="text-sm text-white/80">Author</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Content section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <Link href="/blog">
                <Button variant="ghost" className="flex items-center gap-2">
                  <ChevronLeft size={16} />
                  Back to Articles
                </Button>
              </Link>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 size={16} />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Bookmark size={16} />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart size={16} />
                </Button>
              </div>
            </div>
            
            {/* Article content */}
            <motion.div 
              ref={contentRef}
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Social sharing */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Share this article</h4>
                  <p className="text-gray-600">If you found this article helpful, please share it with your network</p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" size="icon" className="rounded-full bg-blue-50 hover:bg-blue-100 border-blue-200">
                    <Facebook size={18} className="text-blue-600" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full bg-sky-50 hover:bg-sky-100 border-sky-200">
                    <Twitter size={18} className="text-sky-500" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full bg-blue-50 hover:bg-blue-100 border-blue-200">
                    <Linkedin size={18} className="text-blue-700" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Author section */}
            <motion.div 
              className="mt-12 bg-gray-50 rounded-xl p-8 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <img 
                      src={post.authorImageUrl || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5'} 
                      alt={post.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{post.author}</h3>
                  <p className="text-gray-700 mb-4">
                    Full-stack developer and technology enthusiast with a passion for building innovative solutions.
                    Specializing in web applications, trading systems, and business automation.
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm" className="rounded-full">
                      View Profile
                    </Button>
                    <Button size="sm" className="rounded-full">
                      Follow
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Comments section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Discussion (12)</h3>
                <Button className="rounded-full">
                  <MessageCircle size={16} className="mr-2" />
                  Add Comment
                </Button>
              </div>
              
              {/* This would be replaced with actual comments */}
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-800">Jane Cooper</h4>
                        <span className="text-sm text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-gray-700">
                        Great article! I've been looking for a simple way to get started with trading bots. This approach seems very approachable.
                      </p>
                      <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
                        <button className="flex items-center hover:text-gray-700">
                          <Heart size={14} className="mr-1" />
                          Like (3)
                        </button>
                        <button className="flex items-center hover:text-gray-700">
                          <MessageCircle size={14} className="mr-1" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-800">Alex Johnson</h4>
                        <span className="text-sm text-gray-500">3 days ago</span>
                      </div>
                      <p className="text-gray-700">
                        Have you considered implementing a machine learning approach instead of technical indicators? I've found that neural networks can be quite effective for price prediction.
                      </p>
                      <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
                        <button className="flex items-center hover:text-gray-700">
                          <Heart size={14} className="mr-1" />
                          Like (1)
                        </button>
                        <button className="flex items-center hover:text-gray-700">
                          <MessageCircle size={14} className="mr-1" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">Load More Comments</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related articles */}
      {relatedPostsData.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Related Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPostsData.map((relatedPost) => (
                <motion.div 
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="h-40 relative overflow-hidden">
                      <img 
                        src={relatedPost.imageUrl} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[relatedPost.category].bg} ${categoryColors[relatedPost.category].text}`}>
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center text-xs text-gray-500 space-x-3 mb-2">
                        <span>{relatedPost.date}</span>
                        <span>•</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">
                        <Link href={`/blog/${relatedPost.id}`}>{relatedPost.title}</Link>
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      
                      <Link href={`/blog/${relatedPost.id}`}>
                        <Button variant="ghost" className="mt-auto self-start text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-0">
                          Read Article
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">Subscribe to My Newsletter</h2>
              <p className="text-white/80 mb-8">Get weekly articles on development, trading bots, and technology trends</p>
              
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="px-4 py-3 rounded-lg focus:outline-none text-gray-800 min-w-[300px]"
                />
                <Button className="bg-white text-indigo-600 hover:bg-gray-100 rounded-lg">
                  Subscribe
                </Button>
              </div>
              
              <p className="text-sm mt-4 text-white/70">
                By subscribing, you agree to receive email updates. You can unsubscribe at any time.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}