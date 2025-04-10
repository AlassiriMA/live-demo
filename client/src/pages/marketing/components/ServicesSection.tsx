import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    id: 1,
    title: "Social Media Marketing",
    description: "Engage your audience and build brand loyalty with strategic social media management across all major platforms.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
    metrics: [
      { label: "Engagement Rate", value: "+138%" },
      { label: "Follower Growth", value: "+85%" }
    ]
  },
  {
    id: 2,
    title: "Search Engine Optimization",
    description: "Improve your visibility in search results with technical SEO, content optimization, and backlink strategies.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    metrics: [
      { label: "Organic Traffic", value: "+210%" },
      { label: "Rankings", value: "Top 3" }
    ]
  },
  {
    id: 3,
    title: "Email Marketing",
    description: "Drive conversions with personalized email campaigns, automated workflows, and strategic segmentation.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    metrics: [
      { label: "Open Rate", value: "32.7%" },
      { label: "Conversion", value: "+24%" }
    ]
  },
  {
    id: 4,
    title: "Content Marketing",
    description: "Tell your brand story with compelling blogs, videos, infographics, and other content that resonates with your audience.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    metrics: [
      { label: "Time on Page", value: "+145%" },
      { label: "Sharing", value: "+92%" }
    ]
  },
  {
    id: 5,
    title: "Paid Advertising",
    description: "Maximize ROI with strategic PPC campaigns across search, social, and display networks with precise targeting.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    metrics: [
      { label: "ROAS", value: "4.3x" },
      { label: "CTR", value: "7.8%" }
    ]
  },
  {
    id: 6,
    title: "Analytics & Reporting",
    description: "Gain insights to make data-driven decisions with comprehensive analytics and custom dashboard reporting.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    metrics: [
      { label: "Conversion Rate", value: "+85%" },
      { label: "Revenue", value: "+128%" }
    ]
  }
];

export default function ServicesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Digital Marketing Services
            </h2>
            <p className="text-lg text-gray-700">
              Comprehensive solutions to help your business thrive in the digital landscape.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-bg h-full hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                      {service.icon}
                    </div>
                    <h3 className="font-heading font-bold text-xl text-gray-900">{service.title}</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{service.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {service.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-sm text-gray-600">{metric.label}</div>
                        <div className="text-lg font-bold text-[#EC4899]">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
