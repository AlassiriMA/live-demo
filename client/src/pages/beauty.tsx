import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  CheckCircle2, 
  Star
} from 'lucide-react';

export default function BeautyCenter() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  // Expertise level circles with percentage animation
  const ExpertiseCircle = ({ 
    percentage, 
    name, 
    color 
  }: { 
    percentage: number; 
    name: string; 
    color: string;
  }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-2">
          <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
            <circle 
              className="opacity-20"
              strokeWidth="8" 
              stroke={color}
              fill="transparent" 
              r={radius} 
              cx="50" 
              cy="50" 
            />
            <motion.circle 
              className="transition-all duration-1000 ease-out"
              strokeWidth="8" 
              strokeDasharray={circumference} 
              strokeDashoffset={circumference} 
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              strokeLinecap="round" 
              stroke={color} 
              fill="transparent" 
              r={radius} 
              cx="50" 
              cy="50" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold" style={{ color }}>{percentage}%</span>
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </div>
    );
  };
  
  const services = [
    {
      id: 'haircut',
      name: 'Haircut & Styling',
      description: 'Professional haircuts tailored to your face shape and personal style.',
      price: '$45 - $95',
      duration: '45 - 60 min',
      image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803',
      expertise: 98
    },
    {
      id: 'coloring',
      name: 'Hair Coloring',
      description: 'From subtle highlights to bold transformations using premium, gentle products.',
      price: '$85 - $200',
      duration: '90 - 180 min',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df',
      expertise: 95
    },
    {
      id: 'facial',
      name: 'Facial Treatments',
      description: 'Revitalize your skin with customized facials addressing your specific needs.',
      price: '$75 - $150',
      duration: '60 - 90 min',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881',
      expertise: 90
    },
    {
      id: 'makeup',
      name: 'Professional Makeup',
      description: 'Expert makeup application for special events or everyday glam.',
      price: '$65 - $120',
      duration: '45 - 60 min',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e',
      expertise: 92
    },
    {
      id: 'manicure',
      name: 'Manicure & Pedicure',
      description: 'Nail care and artistry using high-quality, long-lasting products.',
      price: '$35 - $85',
      duration: '30 - 75 min',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
      expertise: 94
    },
    {
      id: 'massage',
      name: 'Relaxation Massage',
      description: 'Therapeutic massage techniques to reduce stress and promote wellness.',
      price: '$80 - $150',
      duration: '60 - 90 min',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
      expertise: 88
    }
  ];
  
  const testimonials = [
    {
      name: 'Emma Lawrence',
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      testimonial: "I have been coming here for years and the quality has never disappointed. My stylist always knows exactly what will work for my hair type.",
      rating: 5
    },
    {
      name: 'Michael Chen',
      photo: 'https://randomuser.me/api/portraits/men/52.jpg',
      testimonial: "The massage therapy here is exceptional. The atmosphere is calm and the staff is incredibly professional.",
      rating: 5
    },
    {
      name: 'Sophia Martinez',
      photo: 'https://randomuser.me/api/portraits/women/23.jpg',
      testimonial: "The facial treatment completely transformed my skin. I have received so many compliments since my visit!",
      rating: 4
    }
  ];
  
  const createStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <AppShell>
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="h-[70vh] bg-cover bg-center" 
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1560750588-73207b1ef5b8)' 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/80 to-purple-500/60"></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-3xl">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                Glow & Style
              </motion.h1>
              <motion.p 
                className="text-xl text-white mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Premium hair and beauty center dedicated to bringing out your natural beauty and confidence.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <Button className="bg-white text-pink-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-xl">
                  Book an Appointment
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Our <span className="text-pink-500">Philosophy</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                At Glow & Style, we believe that true beauty comes from within. Our approach is to enhance your natural 
                features while making you feel comfortable and relaxed in our luxurious space.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2010, our salon has grown to become a premium destination for those seeking the highest 
                quality beauty treatments performed by industry experts with years of experience.
              </p>
              <div className="flex space-x-8 mb-8">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-pink-500">12+</span>
                  <span className="text-gray-500 text-sm">Years Experience</span>
                </div>
                <div className="text-center">
                  <span className="block text-3xl font-bold text-pink-500">15K+</span>
                  <span className="text-gray-500 text-sm">Happy Clients</span>
                </div>
                <div className="text-center">
                  <span className="block text-3xl font-bold text-pink-500">20+</span>
                  <span className="text-gray-500 text-sm">Expert Stylists</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src="https://randomuser.me/api/portraits/women/65.jpg"
                    alt="Founder"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="block font-medium text-gray-800">Sarah Johnson</span>
                  <span className="text-pink-500 text-sm">Founder & Chief Stylist</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden shadow-lg h-40 md:h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2"
                    alt="Salon Interior"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg h-40 md:h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1470259078422-826894b933aa"
                    alt="Beauty Products"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-lg overflow-hidden shadow-lg h-40 md:h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1607008829749-c8c5ba81a702"
                    alt="Hair Styling"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg h-40 md:h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b"
                    alt="Facial Treatment"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Premium Services</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We offer a comprehensive range of beauty and wellness services, each performed 
              by specialists with years of experience in their field.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service) => (
              <motion.div 
                key={service.id}
                variants={itemVariants}
                className={`rounded-xl overflow-hidden shadow-md transition-all duration-300 
                  ${selectedService === service.id ? 'ring-2 ring-pink-500 scale-[1.02]' : 'hover:shadow-lg'}`}
                onClick={() => setSelectedService(service.id === selectedService ? null : service.id)}
              >
                <div className="h-48 relative overflow-hidden">
                  {service.image && (
                    <img 
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  )}
                  <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                      <ExpertiseCircle
                        percentage={service.expertise}
                        name=""
                        color="#EC4899"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between text-sm mb-4">
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{service.duration}</span>
                    </div>
                    <span className="font-medium text-pink-500">{service.price}</span>
                  </div>
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                    Book Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Expertise & Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="expertise" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="expertise" className="px-8">Our Expertise</TabsTrigger>
                <TabsTrigger value="testimonials" className="px-8">Client Testimonials</TabsTrigger>
                <TabsTrigger value="gallery" className="px-8">Gallery</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="expertise">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Areas of Expertise</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <ExpertiseCircle percentage={98} name="Hair Styling" color="#EC4899" />
                  <ExpertiseCircle percentage={95} name="Coloring" color="#8B5CF6" />
                  <ExpertiseCircle percentage={92} name="Makeup" color="#F59E0B" />
                  <ExpertiseCircle percentage={94} name="Nail Art" color="#10B981" />
                </div>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Top-Tier Products</h4>
                    <p className="text-gray-600 mb-4">
                      We use only the highest quality, cruelty-free products that are gentle on your 
                      hair and skin while delivering exceptional results.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2" />
                        <span className="text-gray-700">Organic and environmentally friendly</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2" />
                        <span className="text-gray-700">Suitable for sensitive skin</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2" />
                        <span className="text-gray-700">Long-lasting and fade-resistant colors</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Professional Team</h4>
                    <p className="text-gray-600 mb-4">
                      Our team of stylists and beauty specialists undergo continuous training to stay 
                      updated with the latest techniques and trends.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2" />
                        <span className="text-gray-700">15+ years of combined experience</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2" />
                        <span className="text-gray-700">Specialized in various hair textures</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2" />
                        <span className="text-gray-700">Internationally certified professionals</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="testimonials">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">What Our Clients Say</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <img 
                            src={testimonial.photo}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                          <div className="flex mt-1">
                            {createStars(testimonial.rating)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 italic">"{testimonial.testimonial}"</p>
                    </Card>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50">
                    View All Reviews
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="gallery">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="rounded-lg overflow-hidden shadow-sm h-40 md:h-60">
                      <img 
                        src={`https://source.unsplash.com/random/300x400?hair,beauty,salon&sig=${i}`}
                        alt={`Gallery image ${i+1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50">
                    View Full Gallery
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Visit Our Salon</h2>
              <div className="bg-gray-100 h-80 rounded-lg mb-6">
                {/* Placeholder for a map */}
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Contact Information</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-600">
                      <Phone className="h-5 w-5 text-pink-500 mr-3" />
                      <span>(555) 123-4567</span>
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Mail className="h-5 w-5 text-pink-500 mr-3" />
                      <span>info@glowandstyle.com</span>
                    </li>
                    <li className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 text-pink-500 mr-3" />
                      <span>123 Beauty Lane, Suite 100, New York, NY 10001</span>
                    </li>
                  </ul>
                  <div className="flex space-x-4 mt-4">
                    <a href="#" className="p-2 bg-pink-100 rounded-full text-pink-500 hover:bg-pink-200 transition-colors">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="#" className="p-2 bg-pink-100 rounded-full text-pink-500 hover:bg-pink-200 transition-colors">
                      <Facebook className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Working Hours</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-gray-600">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 8:00 PM</span>
                    </li>
                    <li className="flex justify-between text-gray-600">
                      <span>Saturday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between text-gray-600">
                      <span>Sunday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Book an Appointment</h2>
                <p className="text-gray-600 mb-6">
                  Fill out the form below to schedule your appointment. Our team will 
                  confirm your booking within 24 hours.
                </p>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
                        placeholder="Your phone"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Select a service</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>{service.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                      <select 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      >
                        <option value="">Select a time</option>
                        <option value="morning">Morning (9AM - 12PM)</option>
                        <option value="afternoon">Afternoon (12PM - 4PM)</option>
                        <option value="evening">Evening (4PM - 8PM)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                    <textarea 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500" 
                      rows={3}
                      placeholder="Any additional information..."
                    ></textarea>
                  </div>
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3">
                    Book Appointment
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}