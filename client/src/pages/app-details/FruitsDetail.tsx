import AppShell from "@/components/layout/AppShell";
import { apps } from "@/lib/app-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function FruitsDetail() {
  // Find the Fruits app from the apps array
  const fruitsApp = apps.find(app => app.id === "fruits")!;

  return (
    <AppShell>
      <section className="py-16 bg-gradient-to-b from-green-50 to-white">
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
                      src={fruitsApp.imageUrl} 
                      alt={fruitsApp.name} 
                      className="w-full h-64 object-cover" 
                    />
                    <div className="p-6" style={{ background: `linear-gradient(to right, ${fruitsApp.primaryColor}0A, ${fruitsApp.secondaryColor}0A)` }}>
                      <div className="flex gap-2 mb-4">
                        {fruitsApp.tags.map(tag => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                      <h1 className="text-3xl font-bold mb-2 text-gray-800">{fruitsApp.name}</h1>
                      <p className="text-gray-600 mb-4">{fruitsApp.description}</p>
                      <div className="flex gap-4">
                        <Button 
                          className="rounded-lg" 
                          style={{ 
                            backgroundColor: fruitsApp.primaryColor,
                            borderColor: fruitsApp.primaryColor,
                            color: "white" 
                          }}
                          asChild
                        >
                          <Link href={fruitsApp.route}>
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
                    Fruits & Greens is an eco-conscious e-commerce platform dedicated to connecting consumers directly with sustainable produce suppliers. The platform's design prioritizes an organic, clean aesthetic that reflects the natural, fresh products it showcases.
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
                          <h4 className="font-semibold text-gray-800">Sustainable Sourcing Details</h4>
                          <p className="text-gray-600">Transparency in product origins with detailed sustainability metrics for each producer.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 rounded-full p-1 mt-1 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Seasonal Product Highlights</h4>
                          <p className="text-gray-600">Dynamic seasonal collections that promote local, in-season produce to reduce the carbon footprint.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 rounded-full p-1 mt-1 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Eco-Friendly Packaging Options</h4>
                          <p className="text-gray-600">Selection of packaging preferences with information on environmental impact for each option.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 rounded-full p-1 mt-1 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Community-Supported Agriculture Integration</h4>
                          <p className="text-gray-600">Options to subscribe to regular deliveries directly from local farms, supporting sustainable agriculture.</p>
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
                        <p className="font-medium text-gray-800">Stripe</p>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <p className="font-medium text-gray-800">SEO</p>
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

            <div className="bg-green-50 rounded-xl p-8 mt-12 border border-green-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Implementation Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Design Philosophy</h3>
                  <p className="text-gray-600 mb-4">
                    The Fruits & Greens application embraces a clean, organic design language that reflects the natural products it showcases. The interface uses soft curves, plenty of white space, and earth tones to create a calming shopping experience.
                  </p>
                  <p className="text-gray-600">
                    The color palette is based on gentle greens that evoke freshness and sustainability while ensuring high readability and a connection to nature. Photography is given prominence to showcase the beauty of fresh produce.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Technical Architecture</h3>
                  <p className="text-gray-600 mb-4">
                    The application follows a modern e-commerce architecture with React on the frontend and an Express API backend. It integrates Stripe for secure payment processing and implements SEO best practices for maximum visibility.
                  </p>
                  <p className="text-gray-600">
                    The product catalog is stored in a PostgreSQL database with Drizzle ORM providing type-safe queries and efficient data retrieval. The application uses TanStack Query for state management and server synchronization.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-3 text-gray-800">User Experience Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="text-green-600 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Streamlined Checkout</h4>
                    <p className="text-gray-600">One-page checkout process with smart defaults and address auto-completion for a frictionless purchase flow.</p>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="text-green-600 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Smart Search</h4>
                    <p className="text-gray-600">Intelligent search with filters for dietary preferences, seasonality, and sustainability metrics.</p>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="text-green-600 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Delivery Scheduling</h4>
                    <p className="text-gray-600">Flexible delivery time slots with real-time availability and carbon-footprint reduction options.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href={fruitsApp.route}>
                <Button 
                  size="lg"
                  className="rounded-lg"
                  style={{ 
                    backgroundColor: fruitsApp.primaryColor,
                    borderColor: fruitsApp.primaryColor,
                    color: "white" 
                  }}
                >
                  Launch the Fruits & Greens Demo
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