import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  content: string;
  imageUrl?: string;
  rating: number;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  
  // Default testimonials if none are provided from the API
  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      name: "John Smith",
      company: "Tech Innovators",
      content: "The marketing strategies provided exceptional results for our campaign! We saw a significant increase in engagement and conversions within just a few months.",
      rating: 5,
      imageUrl: ""
    },
    {
      id: 2,
      name: "Sarah Johnson",
      company: "Green Solutions",
      content: "Our social media presence improved dramatically after working with this team. They truly understand our brand voice and how to connect with our audience.",
      rating: 4,
      imageUrl: ""
    },
    {
      id: 3,
      name: "David Wilson",
      company: "Startup Ventures",
      content: "The ROI we've seen from their marketing strategies has been incredible. They've transformed our approach to digital marketing completely.",
      rating: 5,
      imageUrl: ""
    }
  ];
  
  // Use provided testimonials or fall back to defaults
  const allTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;
  
  // Go to next testimonial
  const nextTestimonial = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allTestimonials.length);
  };
  
  // Go to previous testimonial
  const prevTestimonial = () => {
    setDirection("left");
    setCurrentIndex((prevIndex) => (prevIndex - 1 + allTestimonials.length) % allTestimonials.length);
  };
  
  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      nextTestimonial();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, allTestimonials.length]);
  
  // Animation variants
  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -300 : 300,
      opacity: 0
    })
  };
  
  // Render stars for rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
  
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden py-8 px-4">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex justify-center"
          >
            <Card className="glass-bg w-full max-w-3xl shadow-md overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-6 md:mb-0 md:mr-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#EC4899] to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {allTestimonials[currentIndex].imageUrl ? (
                        <img 
                          src={allTestimonials[currentIndex].imageUrl} 
                          alt={allTestimonials[currentIndex].name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        allTestimonials[currentIndex].name.charAt(0)
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-2">
                      {renderStars(allTestimonials[currentIndex].rating)}
                    </div>
                    <blockquote className="text-gray-700 mb-4 italic">
                      "{allTestimonials[currentIndex].content}"
                    </blockquote>
                    <div className="font-medium text-gray-900">
                      {allTestimonials[currentIndex].name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {allTestimonials[currentIndex].company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-center items-center mt-6 space-x-4">
        <Button
          onClick={prevTestimonial}
          variant="outline"
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-white/70 backdrop-blur-sm border-pink-200 text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        
        <div className="flex space-x-1">
          {allTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? "right" : "left");
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-[#EC4899] w-6' : 'bg-pink-200'}`}
            ></button>
          ))}
        </div>
        
        <Button
          onClick={nextTestimonial}
          variant="outline"
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-white/70 backdrop-blur-sm border-pink-200 text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
