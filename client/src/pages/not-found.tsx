import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CloudOff } from "lucide-react";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  // GSAP animation for background and floating elements
  useEffect(() => {
    if (!containerRef.current || !numberRef.current) return;

    // Animate the 404 number
    gsap.to(numberRef.current, {
      duration: 2,
      y: 15,
      opacity: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // Generate random floating particles
    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];
    
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute bg-indigo-500 rounded-full opacity-30';
      particle.style.width = `${Math.random() * 10 + 5}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      container.appendChild(particle);
      particles.push(particle);
      
      // Animate each particle
      gsap.to(particle, {
        x: gsap.utils.random(-100, 100),
        y: gsap.utils.random(-100, 100),
        opacity: gsap.utils.random(0.1, 0.5),
        duration: gsap.utils.random(2, 5),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2
      });
    }
    
    return () => {
      // Cleanup particles on unmount
      particles.forEach(p => p.remove());
    };
  }, []);

  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 10
      } 
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-full flex items-center justify-center relative bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden text-white"
    >
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Grid pattern background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <motion.div
        className="relative z-10 mx-auto px-4 py-16 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Large 404 Number */}
        <div 
          ref={numberRef} 
          className="text-[180px] md:text-[250px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 opacity-20 select-none absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-0"
        >
          404
        </div>

        <motion.div
          variants={itemVariants}
          className="w-48 h-48 relative mb-8 mx-auto transform transition-all duration-300 hover:scale-105 cursor-pointer"
          whileHover={{ 
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.5 }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
          <CloudOff className="w-full h-full p-10 text-white" />
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold mb-4 relative z-10"
        >
          Page Not Found
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-xl text-gray-300 mb-8 max-w-md mx-auto"
        >
          Oops! It seems you've ventured into the digital void. The page you're looking for doesn't exist in this universe.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link href="/">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
