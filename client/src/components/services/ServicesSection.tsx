import React from 'react';
import { motion } from 'framer-motion';
import { Code, Lightbulb, Globe, Database, PenTool, Bot, Smartphone, Shield } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, iconColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className={`w-12 h-12 rounded-lg ${iconColor} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export function ServicesSection() {
  const services: ServiceCardProps[] = [
    {
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern frameworks and technologies.',
      icon: <Globe className="h-6 w-6 text-white" />,
      iconColor: 'bg-blue-500'
    },
    {
      title: 'Backend Development',
      description: 'Scalable server-side solutions with robust APIs and database architecture.',
      icon: <Database className="h-6 w-6 text-white" />,
      iconColor: 'bg-indigo-500'
    },
    {
      title: 'UI/UX Design',
      description: 'Intuitive and visually appealing interfaces that enhance user experience.',
      icon: <PenTool className="h-6 w-6 text-white" />,
      iconColor: 'bg-purple-500'
    },
    {
      title: 'AI Integration',
      description: 'Implement cutting-edge AI solutions to enhance application functionality.',
      icon: <Bot className="h-6 w-6 text-white" />,
      iconColor: 'bg-cyan-500'
    },
    {
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      icon: <Smartphone className="h-6 w-6 text-white" />,
      iconColor: 'bg-rose-500'
    },
    {
      title: 'Code Consultation',
      description: 'Professional consultation on architectural decisions and best practices.',
      icon: <Code className="h-6 w-6 text-white" />,
      iconColor: 'bg-emerald-500'
    },
    {
      title: 'Digital Innovation',
      description: 'Strategic solutions that leverage technology for business growth.',
      icon: <Lightbulb className="h-6 w-6 text-white" />,
      iconColor: 'bg-amber-500'
    },
    {
      title: 'Security Audits',
      description: 'Comprehensive analysis of applications for vulnerabilities and threats.',
      icon: <Shield className="h-6 w-6 text-white" />,
      iconColor: 'bg-red-500'
    }
  ];

  return (
    <section id="services" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-3">Services I Offer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional expertise across multiple domains to bring your digital vision to life with precision and excellence.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a 
            href="#contact" 
            className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-full font-medium transition-colors"
          >
            Discuss Your Project
          </a>
        </motion.div>
      </div>
    </section>
  );
}