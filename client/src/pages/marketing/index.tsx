import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "@/components/layout/AppShell";
import ServicesSection from "./components/ServicesSection";
import TestimonialsCarousel from "./components/TestimonialsCarousel";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

// Import the testimonial interface directly from the component
interface Testimonial {
  id: number;
  name: string;
  company: string;
  content: string;
  imageUrl?: string;
  rating: number;
}

export default function Marketing() {
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/marketing/testimonials"],
  });

  return (
    <AppShell>
      <Helmet>
        <title>Digital Marketing & Social Media Manager | Alassiri</title>
        <meta name="description" content="A full-stack marketing showcase with flair, testimonials, case studies, chatbot help, and a funnel-ready design that converts leads to clients." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute -top-20 left-0 w-64 h-64 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-20 filter blur-3xl"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-20 filter blur-3xl"></div>
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 mx-auto px-4">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <motion.div 
                className="lg:w-1/2 mb-10 lg:mb-0 z-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Digital Marketing & <br />
                  <span className="text-[#EC4899]">Online Presence Services</span>
                </h1>
                <p className="text-lg text-gray-700 mb-8 max-w-lg">
                  Elevate your brand's digital footprint with personalized marketing strategies tailored to your unique goals.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-[#EC4899] hover:bg-[#DB2777] text-white px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all"
                    onClick={() => {
                      const contactSection = document.getElementById('contact-section');
                      if (contactSection) {
                        window.scrollTo({
                          top: contactSection.offsetTop,
                          behavior: 'smooth'
                        });
                      }
                    }}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-white/50 backdrop-blur-sm border-purple-200 text-gray-800 px-8 py-6 rounded-full hover:bg-white/70 transition-all"
                    onClick={() => {
                      const servicesSection = document.getElementById('services-section');
                      if (servicesSection) {
                        window.scrollTo({
                          top: servicesSection.offsetTop,
                          behavior: 'smooth'
                        });
                      }
                    }}
                  >
                    Our Services
                  </Button>
                </div>
              </motion.div>
              
              <motion.div 
                className="lg:w-1/2 relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="glass-bg p-8 rounded-3xl shadow-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#EC4899] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span className="font-medium text-gray-800">Analytics</span>
                        </div>
                        <div className="flex items-end space-x-1">
                          <div className="bg-pink-100 h-10 w-4 rounded-t"></div>
                          <div className="bg-pink-200 h-14 w-4 rounded-t"></div>
                          <div className="bg-pink-300 h-20 w-4 rounded-t"></div>
                          <div className="bg-pink-400 h-16 w-4 rounded-t"></div>
                          <div className="bg-pink-500 h-24 w-4 rounded-t"></div>
                        </div>
                      </div>
                      
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#EC4899] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <span className="font-medium text-gray-800">Social Media</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">f</div>
                          <div className="h-6 w-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs">t</div>
                          <div className="h-6 w-6 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs">i</div>
                          <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">y</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#EC4899] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                          </svg>
                          <span className="font-medium text-gray-800">Email Marketing</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center justify-between mb-1">
                            <span>Open Rate</span>
                            <span className="font-medium text-[#EC4899]">34.2%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-[#EC4899] h-1.5 rounded-full w-1/3"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#EC4899] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                          <span className="font-medium text-gray-800">Conversion</span>
                        </div>
                        <div className="text-2xl font-bold text-[#EC4899]">+124%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Services Section */}
        <section id="services-section">
          <ServicesSection />
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-white/30 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Growing Businesses
              </h2>
              <p className="text-lg text-gray-700">
                See what our clients have to say about our marketing solutions.
              </p>
            </div>
            
            <TestimonialsCarousel testimonials={testimonials as any as Testimonial[]} />
          </div>
        </section>
        
        {/* Case Studies Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Success Stories
              </h2>
              <p className="text-lg text-gray-700">
                Real results for real businesses like yours.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Case Study 1 */}
              <motion.div 
                className="glass-bg rounded-xl overflow-hidden shadow-md"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <img 
                    src="/images/case-studies/tech-growth.svg" 
                    alt="TechWave Startup Success" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">TechWave Startup</h3>
                  <p className="text-gray-700 mb-4">300% increase in qualified leads through targeted social campaigns.</p>
                  <div className="flex items-center space-x-4 text-sm font-medium text-gray-600">
                    <span>#SocialMedia</span>
                    <span>#SEO</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Case Study 2 */}
              <motion.div 
                className="glass-bg rounded-xl overflow-hidden shadow-md"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <img 
                    src="/images/case-studies/email-campaign.svg" 
                    alt="GreenEco Products Email Campaign" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">GreenEco Products</h3>
                  <p className="text-gray-700 mb-4">28% ROI on email campaigns with custom segmentation strategy.</p>
                  <div className="flex items-center space-x-4 text-sm font-medium text-gray-600">
                    <span>#EmailMarketing</span>
                    <span>#ContentStrategy</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Case Study 3 */}
              <motion.div 
                className="glass-bg rounded-xl overflow-hidden shadow-md"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <img 
                    src="/images/case-studies/fitness-growth.svg" 
                    alt="FitLife Gym Chain Success" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">FitLife Gym Chain</h3>
                  <p className="text-gray-700 mb-4">45% increase in membership sign-ups through targeted PPC campaigns.</p>
                  <div className="flex items-center space-x-4 text-sm font-medium text-gray-600">
                    <span>#PPC</span>
                    <span>#ConversionOptimization</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact-section" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto glass-bg rounded-2xl overflow-hidden shadow-lg">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 bg-gradient-to-br from-[#EC4899] to-purple-600 text-white">
                  <h2 className="font-heading text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
                  <p className="mb-6">Get a free strategy consultation. Let's discuss how we can help you achieve your marketing goals.</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>me@alassiri.nl</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+316 10979730</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Amsterdam, the Netherlands</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 md:p-12 bg-white/80 backdrop-blur-sm">
                  <h3 className="font-heading text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
                  
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#EC4899] focus:border-[#EC4899]"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#EC4899] focus:border-[#EC4899]"
                        placeholder="Your email"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#EC4899] focus:border-[#EC4899]"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    
                    <Button className="w-full bg-[#EC4899] hover:bg-[#DB2777] text-white">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
