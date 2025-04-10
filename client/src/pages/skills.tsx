import AppShell from "@/components/layout/AppShell";
import SectionHeading from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiReact, SiNodedotjs, SiTypescript, SiPostgresql, SiPython, SiDocker, SiTailwindcss, SiGit } from "react-icons/si";
import TechIconsGrid from "@/components/ui/tech-icons-grid";
import { CircularProgress } from "@/components/ui/circular-progress";

export default function Skills() {
  // Animation variant for staggered animations
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
  
  // Core skills with proficiency percentages
  const coreSkills = [
    { name: "React / Next.js", proficiency: 96, icon: <SiReact className="h-10 w-10" />, color: "#61DAFB" },
    { name: "Node.js / Express", proficiency: 93, icon: <SiNodedotjs className="h-10 w-10" />, color: "#339933" },
    { name: "TypeScript", proficiency: 90, icon: <SiTypescript className="h-10 w-10" />, color: "#3178C6" },
    { name: "PostgreSQL", proficiency: 92, icon: <SiPostgresql className="h-10 w-10" />, color: "#4169E1" },
    { name: "Python", proficiency: 88, icon: <SiPython className="h-10 w-10" />, color: "#3776AB" },
    { name: "Docker / DevOps", proficiency: 88, icon: <SiDocker className="h-10 w-10" />, color: "#2496ED" },
    { name: "UI / UX Design", proficiency: 95, icon: <SiTailwindcss className="h-10 w-10" />, color: "#06B6D4" },
    { name: "Git / GitHub", proficiency: 94, icon: <SiGit className="h-10 w-10" />, color: "#F05032" },
  ];

  return (
    <AppShell>
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Skills & Expertise"
            subtitle="A comprehensive overview of my technical skills and business acumen"
            centered
          />
          
          <div className="mt-8 mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-center mb-8">100+ Technologies in My Toolbox</h2>
              <TechIconsGrid />
            </motion.div>
          </div>

          {/* Core Skills Section with Circular Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-5xl mx-auto mb-16"
          >
            <h2 className="text-2xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Core Technical Expertise
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {coreSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-3">
                    <CircularProgress 
                      value={skill.proficiency} 
                      color={skill.color}
                      size={100}
                      strokeWidth={4}
                      showText={true}
                    />
                    <div className="absolute inset-0 flex items-center justify-center" style={{ color: skill.color }}>
                      {skill.icon}
                    </div>
                  </div>
                  <p className="text-center font-medium">{skill.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Tabs defaultValue="technical" className="w-full max-w-5xl mx-auto mt-12">
            <TabsList className="w-full justify-center mb-8">
              <TabsTrigger value="technical" className="text-lg px-8 py-3">Technical Skills</TabsTrigger>
              <TabsTrigger value="business" className="text-lg px-8 py-3">Business Acumen</TabsTrigger>
            </TabsList>

            <TabsContent value="technical" className="space-y-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <p className="text-gray-700 text-lg">
                  I'm proficient in various technologies, including React, Node.js, Python, and SQL. My work demonstrates not just knowledge but real-world applications of these technologies to solve business problems.
                </p>
              </div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                    <div className="bg-blue-100 p-4 rounded-full mb-4">
                      <SiReact className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Frontend Development</h3>
                    <p className="text-gray-600 mb-4">Building responsive, performant, and accessible user interfaces</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">React</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">TypeScript</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">TailwindCSS</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Framer Motion</span>
                    </div>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                    <div className="bg-green-100 p-4 rounded-full mb-4">
                      <SiNodedotjs className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Backend Development</h3>
                    <p className="text-gray-600 mb-4">Creating robust APIs and server-side applications</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Node.js</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Express</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">REST APIs</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Authentication</span>
                    </div>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                    <div className="bg-purple-100 p-4 rounded-full mb-4">
                      <SiPostgresql className="h-10 w-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Database Management</h3>
                    <p className="text-gray-600 mb-4">Designing efficient schemas and optimizing queries</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">PostgreSQL</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Drizzle ORM</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Database Design</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Query Optimization</span>
                    </div>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                    <div className="bg-yellow-100 p-4 rounded-full mb-4">
                      <SiPython className="h-10 w-10 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Data Engineering</h3>
                    <p className="text-gray-600 mb-4">Working with data processing and analysis tools</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Python</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Data Analysis</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">ETL Pipelines</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Financial Data</span>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                      <SiDocker className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">DevOps</h3>
                    <p className="text-gray-600 mb-4">Implementing CI/CD pipelines and containerization</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Docker</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">CI/CD</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Cloud Deployment</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Infrastructure</span>
                    </div>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                    <div className="bg-pink-100 p-4 rounded-full mb-4">
                      <SiTailwindcss className="h-10 w-10 text-pink-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">UI/UX Design</h3>
                    <p className="text-gray-600 mb-4">Creating beautiful and functional user experiences</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">TailwindCSS</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Responsive Design</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Accessibility</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">User Experience</span>
                    </div>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                    <div className="bg-red-100 p-4 rounded-full mb-4">
                      <SiGit className="h-10 w-10 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Version Control</h3>
                    <p className="text-gray-600 mb-4">Managing code with modern version control systems</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Git</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">GitHub</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">GitLab</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Pull Requests</span>
                    </div>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                    <div className="bg-cyan-100 p-4 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Testing</h3>
                    <p className="text-gray-600 mb-4">Ensuring quality with comprehensive testing strategies</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Jest</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Vitest</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Integration Tests</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Unit Tests</span>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>

              <div className="mt-16">
                <h3 className="text-2xl font-bold mb-6 text-center">Projects Showcasing Technical Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div 
                    className="bg-white rounded-xl shadow-md overflow-hidden" 
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="p-6">
                      <h4 className="text-xl font-bold mb-2">Trading Bot Platform</h4>
                      <p className="text-gray-600 mb-4">
                        Developed a sophisticated trading bot platform that analyzes market data in real-time to identify profitable trading opportunities across multiple exchanges.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">React</span>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Node.js</span>
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">WebSockets</span>
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Python</span>
                      </div>
                      <h5 className="font-semibold text-gray-800 mb-1">Key Technical Challenges:</h5>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>Real-time data processing from multiple exchanges</li>
                        <li>Implementing trading algorithms with risk management</li>
                        <li>Building a responsive dashboard for monitoring</li>
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                  >
                    <div className="p-6">
                      <h4 className="text-xl font-bold mb-2">E-Commerce Platform</h4>
                      <p className="text-gray-600 mb-4">
                        Created a full-featured e-commerce solution with inventory management, payment processing, and customer relationship management.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">TypeScript</span>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Express</span>
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">PostgreSQL</span>
                        <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">TailwindCSS</span>
                      </div>
                      <h5 className="font-semibold text-gray-800 mb-1">Key Technical Challenges:</h5>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>Implementing secure payment processing</li>
                        <li>Creating efficient inventory management system</li>
                        <li>Optimizing search functionality for large product catalogs</li>
                      </ul>
                    </div>
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="business" className="space-y-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <p className="text-gray-700 text-lg">
                  As someone who has worked in business development and software creation, I focus on building solutions that bridge the gap between technology and business. I understand the real-world impact of well-executed software.
                </p>
              </div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold">Market Analysis</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      I combine data-driven insights with market knowledge to identify opportunities and threats in the competitive landscape.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>Competitor analysis and benchmarking</li>
                      <li>Market sizing and opportunity assessment</li>
                      <li>User research and persona development</li>
                      <li>Trend identification and forecasting</li>
                    </ul>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold">Financial Acumen</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      I understand the financial implications of business decisions and how technology investments impact the bottom line.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>ROI analysis for technology initiatives</li>
                      <li>Budget planning and resource allocation</li>
                      <li>Cost optimization strategies</li>
                      <li>Pricing model development</li>
                    </ul>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold">Project Management</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      I excel at planning, executing, and delivering complex projects on time and within budget constraints.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>Agile methodology implementation</li>
                      <li>Resource planning and team coordination</li>
                      <li>Stakeholder communication</li>
                      <li>Risk management and mitigation</li>
                    </ul>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold">Strategic Planning</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      I develop comprehensive strategies that align technology initiatives with broader business objectives.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>Technology roadmap development</li>
                      <li>Go-to-market strategy planning</li>
                      <li>Competitive positioning</li>
                      <li>Long-term vision alignment</li>
                    </ul>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold">Team Leadership</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      I build and lead high-performing teams by fostering collaboration, mentorship, and continuous improvement.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>Cross-functional team coordination</li>
                      <li>Talent recruitment and development</li>
                      <li>Performance management</li>
                      <li>Culture building and motivation</li>
                    </ul>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold">Problem Solving</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      I approach business challenges with a structured methodology, focusing on root causes and sustainable solutions.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>Business process optimization</li>
                      <li>Bottleneck identification and elimination</li>
                      <li>Efficiency improvement initiatives</li>
                      <li>Data-driven decision making</li>
                    </ul>
                  </Card>
                </motion.div>
              </motion.div>

              <div className="mt-16 bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Business Impact Case Studies</h3>
                
                <div className="space-y-8">
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <h4 className="text-xl font-bold mb-2">E-Commerce Revenue Optimization</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm mb-1">Challenge</p>
                        <p className="text-gray-700">Declining conversion rates and increasing cart abandonment</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm mb-1">Approach</p>
                        <p className="text-gray-700">Data analysis, UX audit, and A/B testing program</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm mb-1">Solution</p>
                        <p className="text-gray-700">Streamlined checkout process and personalized recommendations</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm mb-1">Result</p>
                        <p className="text-gray-700">32% increase in conversion rate, 28% reduction in abandonment</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="text-xl font-bold mb-2">Financial Services Platform Transformation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm mb-1">Challenge</p>
                        <p className="text-gray-700">Legacy system limiting scalability and new feature rollout</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm mb-1">Approach</p>
                        <p className="text-gray-700">Modular architecture redesign with phased implementation</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm mb-1">Solution</p>
                        <p className="text-gray-700">Microservices architecture with API-first design</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-sm mb-1">Result</p>
                        <p className="text-gray-700">85% faster deployment cycles and 40% cost reduction</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </AppShell>
  );
}