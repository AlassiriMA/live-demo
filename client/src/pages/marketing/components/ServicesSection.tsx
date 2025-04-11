import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    id: 1,
    title: "SEO & Ranking",
    description: "Boost visibility with strategic optimization that puts you at the top of search results.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    metrics: [
      { label: "Organic Traffic", value: "+210%" },
      { label: "Rankings", value: "Top 3" }
    ],
    color: "pink"
  },
  {
    id: 2,
    title: "Content Marketing",
    description: "Engaging content that tells your story and resonates with your target audience.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    metrics: [
      { label: "Time on Page", value: "+145%" },
      { label: "Sharing", value: "+92%" }
    ],
    color: "purple"
  },
  {
    id: 3,
    title: "Social Media Growth",
    description: "Strategic engagement that builds communities and drives meaningful connections.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    metrics: [
      { label: "Engagement Rate", value: "+138%" },
      { label: "Follower Growth", value: "+85%" }
    ],
    color: "blue"
  },
  {
    id: 4,
    title: "AI Chatbot Assistant",
    description: "24/7 intelligent support that engages visitors and converts prospects into customers.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    metrics: [
      { label: "Response Time", value: "Instant" },
      { label: "Conversion Rate", value: "+43%" }
    ],
    color: "pink"
  },
  {
    id: 5,
    title: "Analytics & Insights",
    description: "Data-driven decisions with comprehensive metrics that track performance and growth.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    metrics: [
      { label: "Revenue Insights", value: "+128%" },
      { label: "Data Accuracy", value: "99.9%" }
    ],
    color: "green"
  },
  {
    id: 6,
    title: "Email Marketing",
    description: "Targeted campaigns that nurture leads and drive conversions with personalized messaging.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    metrics: [
      { label: "Open Rate", value: "32.7%" },
      { label: "Conversion", value: "+24%" }
    ],
    color: "amber"
  },
  {
    id: 7,
    title: "Video Marketing",
    description: "Compelling video content that increases engagement and builds deeper brand connections.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    metrics: [
      { label: "View Duration", value: "+78%" },
      { label: "Share Rate", value: "+62%" }
    ],
    color: "red"
  },
  {
    id: 8,
    title: "Conversion Optimization",
    description: "Fine-tuned funnels that transform visitors into loyal customers and grow revenue.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    metrics: [
      { label: "Conversion Rate", value: "+85%" },
      { label: "ROAS", value: "4.3x" }
    ],
    color: "indigo"
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
              Digital Marketing & Online Presence Services
            </h2>
            <p className="text-lg text-gray-700">
              Elevate your brand's digital footprint with personalized strategies tailored to your unique goals.
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
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                      service.color === 'pink' ? 'bg-pink-100' :
                      service.color === 'purple' ? 'bg-purple-100' :
                      service.color === 'blue' ? 'bg-blue-100' :
                      service.color === 'green' ? 'bg-green-100' :
                      service.color === 'amber' ? 'bg-amber-100' :
                      service.color === 'red' ? 'bg-red-100' :
                      service.color === 'indigo' ? 'bg-indigo-100' : 'bg-gray-100'
                    }`}>
                      {service.icon}
                    </div>
                    <h3 className="font-heading font-bold text-xl text-gray-900">{service.title}</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{service.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {service.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-sm text-gray-600">{metric.label}</div>
                        <div className={`text-lg font-bold ${
                          service.color === 'pink' ? 'text-pink-600' :
                          service.color === 'purple' ? 'text-purple-600' :
                          service.color === 'blue' ? 'text-blue-600' :
                          service.color === 'green' ? 'text-green-600' :
                          service.color === 'amber' ? 'text-amber-600' :
                          service.color === 'red' ? 'text-red-600' :
                          service.color === 'indigo' ? 'text-indigo-600' : 'text-gray-600'
                        }`}>{metric.value}</div>
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
