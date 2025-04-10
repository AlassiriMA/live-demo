import AppShell from "@/components/layout/AppShell";
import SectionHeading from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

// Mock blog data
const blogPosts = [
  {
    id: 1,
    title: "How to Build a Trading Bot in 30 Minutes",
    excerpt: "In this tutorial, we'll explore how to quickly build a simple trading bot that can analyze market data and execute trades based on predefined strategies.",
    date: "April 5, 2025",
    category: "Development",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Mohammad Alassiri"
  },
  {
    id: 2,
    title: "The Future of E-commerce: Trends in Tech",
    excerpt: "Explore the emerging technologies that are reshaping the e-commerce landscape and how businesses can leverage them to create better shopping experiences.",
    date: "March 22, 2025",
    category: "Business",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Mohammad Alassiri"
  },
  {
    id: 3,
    title: "Designing for UX: Neumorphism in Practice",
    excerpt: "A deep dive into the neumorphic design trend and how to implement it in your applications while maintaining accessibility and usability.",
    date: "March 10, 2025",
    category: "Design",
    readTime: "10 min read",
    imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Mohammad Alassiri"
  },
  {
    id: 4,
    title: "Building Real-time Dashboards with React and WebSockets",
    excerpt: "Learn how to create dynamic, real-time dashboards that automatically update as new data becomes available using React and WebSockets.",
    date: "February 28, 2025",
    category: "Development",
    readTime: "12 min read",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Mohammad Alassiri"
  },
  {
    id: 5,
    title: "PostgreSQL Performance Optimization Techniques",
    excerpt: "A comprehensive guide to improving your PostgreSQL database performance through indexing, query optimization, and proper schema design.",
    date: "February 15, 2025",
    category: "Database",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Mohammad Alassiri"
  },
  {
    id: 6,
    title: "The Psychology of Effective UI Design",
    excerpt: "Explore how understanding human psychology can help you create more intuitive and engaging user interfaces that drive conversion and satisfaction.",
    date: "January 30, 2025",
    category: "Design",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1534670007418-bc0cecc80c1b?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Mohammad Alassiri"
  }
];

// Category colors
const categoryColors: Record<string, { bg: string, text: string }> = {
  Development: { bg: "bg-blue-100", text: "text-blue-700" },
  Business: { bg: "bg-purple-100", text: "text-purple-700" },
  Design: { bg: "bg-pink-100", text: "text-pink-700" },
  Database: { bg: "bg-green-100", text: "text-green-700" },
};

export default function Blog() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <AppShell>
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Blog & Articles"
            subtitle="Insights, tutorials, and thought leadership on technology and business"
            centered
          />

          <div className="mt-8 mb-12 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800">Welcome to My Blog</h3>
                  <p className="text-gray-600">Sharing knowledge and experiences in software development and business technology</p>
                </div>
              </div>
              <p className="text-gray-700">
                In this blog, I share insights from my journey as a full-stack developer and technology entrepreneur. 
                From technical tutorials to business strategy discussions, my goal is to provide valuable content 
                that helps others navigate the complex intersection of technology and business.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center mb-10">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <Button variant="outline" className="rounded-full">All Categories</Button>
              <Button variant="ghost" className="rounded-full">Development</Button>
              <Button variant="ghost" className="rounded-full">Business</Button>
              <Button variant="ghost" className="rounded-full">Design</Button>
              <Button variant="ghost" className="rounded-full">Database</Button>
            </div>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {blogPosts.map((post) => (
              <motion.div key={post.id} variants={fadeInUp} transition={{ duration: 0.5 }}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[post.category].bg} ${categoryColors[post.category].text}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-gray-800 hover:text-indigo-600 transition-colors">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-6 flex-grow">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                          MA
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{post.author}</p>
                          <p className="text-sm text-gray-500">Author</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="rounded-lg">
              Load More Articles
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </div>

          <div className="mt-16 max-w-3xl mx-auto bg-indigo-50 rounded-xl p-8 border border-indigo-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Subscribe to My Newsletter</h3>
              <p className="text-gray-600">Get the latest articles and updates delivered straight to your inbox</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg">
                Subscribe
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              By subscribing, you agree to receive email updates. You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}