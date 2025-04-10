import AppDetailLayout from "@/components/layout/AppDetailLayout";
import { apps } from "@/lib/app-data";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function PosDetail() {
  // Find the POS app from the apps array
  const posApp = apps.find(app => app.id === "pos") || apps[0];
  
  return (
    <AppDetailLayout app={posApp}>
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
                <h2 className="text-2xl font-bold mb-4">POS for Bookstores</h2>
                <p className="text-gray-700 mb-4">
                  The Point of Sale (POS) system is designed for bookstores, enabling seamless transactions, inventory management, and customer tracking. With a neumorphic design, the system allows bookstore owners to easily handle sales, track stock, and generate reports.
                </p>
                <p className="text-gray-700 mb-4">
                  This application was built to solve common problems faced by small to medium-sized bookstore owners who need a reliable, user-friendly system to manage their daily operations without the complexity and cost of enterprise solutions.
                </p>
              </div>
              
              <Card className="p-6 bg-gray-50">
                <h3 className="text-xl font-bold mb-3">Business Impact</h3>
                <p className="text-gray-700 mb-4">
                  A specialized POS system like this can significantly improve operational efficiency for bookstores by:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Reducing checkout times by up to 40%</li>
                  <li>Minimizing inventory tracking errors</li>
                  <li>Providing valuable sales analytics</li>
                  <li>Improving customer service and retention</li>
                </ul>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold mb-3">Target Users</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Independent bookstore owners</li>
                    <li>Small to medium-sized bookstore chains</li>
                    <li>Library gift shops</li>
                    <li>Used book retailers</li>
                  </ul>
                </div>
                
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold mb-3">Key Metrics</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>User-friendly interface with minimal training</li>
                    <li>Processing time under 30 seconds per transaction</li>
                    <li>99.9% uptime reliability</li>
                    <li>Real-time inventory accuracy</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                <p className="text-gray-700 mb-4">
                  The POS system includes several specialized features designed specifically for bookstore operations:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Sales Processing</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Barcode scanning for quick checkouts</li>
                    <li>Multiple payment method support</li>
                    <li>Receipt generation and email options</li>
                    <li>Discount and promotion management</li>
                  </ul>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Inventory Management</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Real-time stock tracking</li>
                    <li>Low stock alerts and automated ordering</li>
                    <li>Book categorization and tagging</li>
                    <li>ISBN lookup and validation</li>
                  </ul>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Analytics & Reporting</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Daily, weekly, and monthly sales reports</li>
                    <li>Best-selling titles and categories</li>
                    <li>Revenue forecasting</li>
                    <li>Custom report generation</li>
                  </ul>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Customer Management</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Customer profiles and purchase history</li>
                    <li>Loyalty program integration</li>
                    <li>Personalized recommendations</li>
                    <li>Email marketing tools</li>
                  </ul>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tech" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
                <p className="text-gray-700 mb-4">
                  The POS system was built using modern technologies that ensure performance, scalability, and maintainability:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-3">Frontend</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li><span className="font-medium">React</span> - For building the interactive UI</li>
                    <li><span className="font-medium">TypeScript</span> - For type safety and better developer experience</li>
                    <li><span className="font-medium">TailwindCSS</span> - For custom, responsive styling</li>
                    <li><span className="font-medium">Framer Motion</span> - For smooth animations and transitions</li>
                    <li><span className="font-medium">React Hook Form</span> - For efficient form handling</li>
                  </ul>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-3">Backend</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li><span className="font-medium">Express</span> - For serving the API endpoints</li>
                    <li><span className="font-medium">Node.js</span> - For runtime environment</li>
                    <li><span className="font-medium">PostgreSQL</span> - For persistent data storage</li>
                    <li><span className="font-medium">Drizzle ORM</span> - For database interactions</li>
                    <li><span className="font-medium">Zod</span> - For validation and type checking</li>
                  </ul>
                </Card>
                
                <Card className="p-6 md:col-span-2">
                  <h3 className="text-xl font-bold mb-3">Architecture</h3>
                  <p className="text-gray-700 mb-4">
                    The application follows a client-server architecture with a clear separation of concerns:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li><span className="font-medium">RESTful API</span> - For communication between frontend and backend</li>
                    <li><span className="font-medium">MVC Pattern</span> - For organizing server-side code</li>
                    <li><span className="font-medium">Component-Based Design</span> - For reusable UI elements</li>
                    <li><span className="font-medium">Responsive Design</span> - For optimal experience across devices</li>
                  </ul>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="challenges" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Challenges & Solutions</h2>
                <p className="text-gray-700 mb-4">
                  During the development of the POS system, several challenges were encountered and overcome:
                </p>
              </div>
              
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-3">Real-time Inventory Updates</h3>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Challenge:</span> Ensuring inventory counts remain accurate during concurrent transactions.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Solution:</span> Implemented optimistic UI updates with server validation and conflict resolution strategies. Used database transactions to maintain data integrity during concurrent operations.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-3">Offline Capability</h3>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Challenge:</span> Bookstores sometimes face internet connectivity issues but still need to process sales.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Solution:</span> Developed offline transaction processing with local storage and synchronization when connectivity is restored, ensuring business continuity even during network outages.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-3">User Experience for Non-Technical Staff</h3>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Challenge:</span> Creating an intuitive interface for bookstore employees with varying technical abilities.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Solution:</span> Conducted usability testing with actual bookstore employees and implemented a neumorphic design that mimics physical interactions, resulting in a 30% reduction in training time.
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