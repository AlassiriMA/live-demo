import AppShell from "@/components/layout/AppShell";
import { apps } from "@/lib/app-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function PosDetail() {
  // Find the POS app from the apps array
  const posApp = apps.find(app => app.id === "pos")!;

  return (
    <AppShell>
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Link href="/#apps">
                <Button variant="ghost" className="mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to All Apps
                </Button>
              </Link>

              <div className="flex flex-col md:flex-row gap-12 items-start">
                <motion.div 
                  className="md:w-1/2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200">
                    <img 
                      src={posApp.imageUrl} 
                      alt={posApp.name} 
                      className="w-full h-64 object-cover" 
                    />
                    <div className="p-6" style={{ background: `linear-gradient(to right, ${posApp.primaryColor}0A, ${posApp.secondaryColor}0A)` }}>
                      <div className="flex gap-2 mb-4">
                        {posApp.tags.map(tag => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                      <h1 className="text-3xl font-bold mb-2 text-gray-800">{posApp.name}</h1>
                      <p className="text-gray-600 mb-4">{posApp.description}</p>
                      <div className="flex gap-4">
                        <Button 
                          className="rounded-lg" 
                          style={{ 
                            backgroundColor: posApp.primaryColor,
                            borderColor: posApp.primaryColor,
                            color: "white" 
                          }}
                          asChild
                        >
                          <Link href={posApp.route}>
                            Try the Live Demo
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="md:w-1/2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">About This Application</h2>
                  <p className="text-gray-600 mb-6">
                    The POS for Bookstores is a specialized point-of-sale system designed with the unique needs of bookstores in mind. It combines modern design principles with practical functionality to create a seamless checkout experience for both staff and customers.
                  </p>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Key Features</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="bg-green-100 rounded-full p-1 mt-1 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Barcode Integration</h4>
                          <p className="text-gray-600">Quickly scan ISBN codes to add books to the cart, with automatic lookup of titles, authors, and prices.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 rounded-full p-1 mt-1 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Inventory Management</h4>
                          <p className="text-gray-600">Track book stock levels in real-time, with automatic updates when sales are made and easy restocking workflows.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 rounded-full p-1 mt-1 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Offline Capability</h4>
                          <p className="text-gray-600">Continue processing sales even when internet connectivity is lost, with automatic synchronization when back online.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 rounded-full p-1 mt-1 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Sales Analytics</h4>
                          <p className="text-gray-600">View comprehensive reports on bestsellers, sales trends, and revenue metrics to inform business decisions.</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Technologies Used</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <p className="font-medium text-gray-800">React</p>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <p className="font-medium text-gray-800">TypeScript</p>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <p className="font-medium text-gray-800">TailwindCSS</p>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <p className="font-medium text-gray-800">PostgreSQL</p>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <p className="font-medium text-gray-800">Drizzle ORM</p>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <p className="font-medium text-gray-800">TanStack Query</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 mt-12 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Implementation Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Design Philosophy</h3>
                  <p className="text-gray-600 mb-4">
                    The POS system embraces a neumorphic design language, creating a tactile and intuitive interface that feels physical despite being digital. This design choice minimizes cognitive load for bookstore employees who need to process transactions quickly and accurately.
                  </p>
                  <p className="text-gray-600">
                    The color palette is based on subtle indigo tones that create a calm, professional atmosphere while maintaining high readability and contrast for extended use.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Technical Architecture</h3>
                  <p className="text-gray-600 mb-4">
                    The application follows a modern full-stack architecture with a React frontend and Express backend. Data is persisted in a PostgreSQL database using Drizzle ORM for type-safe database operations.
                  </p>
                  <p className="text-gray-600">
                    The frontend implements offline capability through a service worker and IndexedDB, allowing the application to function during internet disruptions without data loss.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-3 text-gray-800">User Experience Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="text-indigo-600 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Fast Transaction Flow</h4>
                    <p className="text-gray-600">Complete sales in as few as 3 clicks, with smart defaults and keyboard shortcuts for power users.</p>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="text-indigo-600 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Customizable Dashboard</h4>
                    <p className="text-gray-600">Arrange widgets and metrics to match your workflow and business priorities.</p>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="text-indigo-600 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Secure Authentication</h4>
                    <p className="text-gray-600">Role-based access control ensures employees can only access appropriate features.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href={posApp.route}>
                <Button 
                  size="lg"
                  className="rounded-lg"
                  style={{ 
                    backgroundColor: posApp.primaryColor,
                    borderColor: posApp.primaryColor,
                    color: "white" 
                  }}
                >
                  Launch the POS Demo
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}