import AppDetailLayout from "@/components/layout/AppDetailLayout";
import { apps } from "@/lib/app-data";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function FruitsDetail() {
  // Find the Fruits app from the apps array
  const fruitsApp = apps.find(app => app.id === "fruits") || apps[1];
  
  return (
    <AppDetailLayout app={fruitsApp}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="tech">Tech Stack</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Fresh Fruits E-Commerce</h2>
                <p className="text-gray-700 mb-4">
                  The Fresh Fruits E-Commerce platform is a modern online store designed for small to medium-sized produce retailers who want to sell fresh fruits and vegetables online. With a vibrant, nature-inspired design, the platform creates an appealing shopping experience that highlights the freshness and quality of organic products.
                </p>
                <p className="text-gray-700 mb-4">
                  This application addresses the growing demand for convenient access to fresh, locally-sourced produce through digital channels, enabling small businesses to compete with larger grocery delivery services.
                </p>
              </div>
              
              <Card className="p-6 bg-gray-50">
                <h3 className="text-xl font-bold mb-3">Business Impact</h3>
                <p className="text-gray-700 mb-4">
                  A specialized e-commerce platform for fresh produce can transform business operations by:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Expanding customer reach beyond physical store limitations</li>
                  <li>Increasing order volume and average order value</li>
                  <li>Reducing food waste through better inventory management</li>
                  <li>Building customer loyalty through convenient shopping experiences</li>
                </ul>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold mb-3">Target Users</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Small organic farms with direct-to-consumer sales</li>
                    <li>Local fruit and vegetable shops</li>
                    <li>Farmer's market vendors looking to expand online</li>
                    <li>Health-conscious consumers seeking quality produce</li>
                  </ul>
                </div>
                
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold mb-3">Key Metrics</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Mobile-first shopping experience</li>
                    <li>95% inventory accuracy rate</li>
                    <li>Average checkout completion time under 2 minutes</li>
                    <li>Seamless delivery scheduling options</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                <p className="text-gray-700 mb-4">
                  The Fresh Fruits E-Commerce platform includes features specifically designed for selling fresh produce online:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Product Catalog</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>High-quality product imagery</li>
                    <li>Detailed nutritional information</li>
                    <li>Seasonal product highlighting</li>
                    <li>Organic certification display</li>
                  </ul>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Seamless Checkout</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Multi-payment method support</li>
                    <li>Address save and auto-fill</li>
                    <li>Delivery time selection</li>
                    <li>Order summary with freshness guarantee</li>
                  </ul>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Delivery Management</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Real-time delivery tracking</li>
                    <li>Delivery window selection</li>
                    <li>Special handling instructions</li>
                    <li>Contactless delivery options</li>
                  </ul>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Order Management</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Order history and reordering</li>
                    <li>Subscription and recurring orders</li>
                    <li>Freshness feedback system</li>
                    <li>Flexible order modification window</li>
                  </ul>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tech" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
                <p className="text-gray-700 mb-4">
                  The Fresh Fruits E-Commerce platform was built using modern technologies focused on performance and user experience:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-3">Frontend</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li><span className="font-medium">React</span> - For building the interactive UI</li>
                    <li><span className="font-medium">TypeScript</span> - For type safety and maintainability</li>
                    <li><span className="font-medium">TailwindCSS</span> - For custom, responsive design</li>
                    <li><span className="font-medium">React Query</span> - For efficient data fetching</li>
                    <li><span className="font-medium">Framer Motion</span> - For smooth animations</li>
                  </ul>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-3">Backend</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li><span className="font-medium">Express</span> - For RESTful API endpoints</li>
                    <li><span className="font-medium">Node.js</span> - For server-side runtime</li>
                    <li><span className="font-medium">PostgreSQL</span> - For data persistence</li>
                    <li><span className="font-medium">Drizzle ORM</span> - For database operations</li>
                    <li><span className="font-medium">Zod</span> - For data validation</li>
                  </ul>
                </Card>
                
                <Card className="p-6 md:col-span-2">
                  <h3 className="text-xl font-bold mb-3">Key Technical Features</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li><span className="font-medium">Responsive Images</span> - Optimized for all device sizes</li>
                    <li><span className="font-medium">Lazy Loading</span> - For improved performance</li>
                    <li><span className="font-medium">PWA Capabilities</span> - For offline access</li>
                    <li><span className="font-medium">Optimistic UI Updates</span> - For better user experience</li>
                    <li><span className="font-medium">Real-time Inventory</span> - For accurate product availability</li>
                  </ul>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="challenges" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Challenges & Solutions</h2>
                <p className="text-gray-700 mb-4">
                  Building an e-commerce platform for fresh produce presented several unique challenges:
                </p>
              </div>
              
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-3">Product Freshness Representation</h3>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Challenge:</span> Conveying product freshness and quality accurately through digital means.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Solution:</span> Implemented high-quality photography standards with consistent lighting, developed a freshness rating system, and included harvest date information for all products.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-3">Inventory Fluctuation</h3>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Challenge:</span> Managing the rapidly changing inventory levels of seasonal and perishable items.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Solution:</span> Created a real-time inventory system with automated alerts for low stock, implemented dynamic pricing based on remaining shelf life, and developed a sophisticated forecasting algorithm for seasonal produce.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-3">Last-Mile Delivery Quality</h3>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Challenge:</span> Ensuring produce quality during the final delivery stage to customers.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Solution:</span> Designed a specialized packaging system with temperature control considerations, created delivery guidelines for handling produce, and implemented a customer feedback loop specific to product condition upon arrival.
                  </p>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppDetailLayout>
  );
}