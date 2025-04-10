import { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { ChevronRight, MessageCircle, Book, Award, FileText, BarChart } from 'lucide-react';

export default function EnglishAI() {
  const [activeLesson, setActiveLesson] = useState<string>('intro');
  const [progressValues, setProgressValues] = useState({
    speaking: 78,
    listening: 85,
    reading: 92,
    writing: 65,
    vocabulary: 72,
    grammar: 80
  });
  
  // Animated progress circles for skills
  const CircularProgress = ({ value, label, color }: { value: number; label: string; color: string }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    
    useEffect(() => {
      const el = document.getElementById(`progress-${label.toLowerCase()}`);
      if (el) {
        el.style.strokeDashoffset = `${strokeDashoffset}px`;
      }
    }, [value, label, strokeDashoffset]);
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              className="text-gray-200" 
              strokeWidth="10" 
              stroke="currentColor" 
              fill="transparent" 
              r={radius} 
              cx="50" 
              cy="50" 
            />
            <circle 
              id={`progress-${label.toLowerCase()}`}
              className="text-opacity-75 transition-all duration-1000 ease-out"
              strokeWidth="10" 
              strokeDasharray={circumference} 
              strokeDashoffset={circumference} 
              strokeLinecap="round" 
              stroke={color} 
              fill="transparent" 
              r={radius} 
              cx="50" 
              cy="50" 
              style={{ 
                transform: 'rotate(-90deg)', 
                transformOrigin: '50% 50%',
                transition: 'stroke-dashoffset 1s ease-in-out'
              }} 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color }}>{value}%</span>
            <span className="text-xs font-medium text-gray-600">{label}</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Animation variants for lessons
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
  
  // Enhanced animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };
  
  const scaleInVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15,
        delayChildren: 0.2,
        duration: 0.3
      }
    }
  };
  
  const popInVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      } 
    }
  };
  
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <Card className="p-6 h-full">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-teal-600 text-xl font-bold">AI</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">English AI Teacher</h3>
                  <p className="text-gray-500 text-sm">Your personal language tutor</p>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-700 mb-2">My Progress</h4>
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Speaking</span>
                    <span className="text-sm font-medium text-teal-500">{progressValues.speaking}%</span>
                  </div>
                  <Progress value={progressValues.speaking} className="h-2 bg-teal-100" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Listening</span>
                    <span className="text-sm font-medium text-indigo-500">{progressValues.listening}%</span>
                  </div>
                  <Progress value={progressValues.listening} className="h-2 bg-indigo-100" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Vocabulary</span>
                    <span className="text-sm font-medium text-amber-500">{progressValues.vocabulary}%</span>
                  </div>
                  <Progress value={progressValues.vocabulary} className="h-2 bg-amber-100" />
                </div>
              </div>
              
              <h4 className="font-medium text-gray-700 mb-3">My Lessons</h4>
              <nav className="space-y-1">
                <Button 
                  variant={activeLesson === 'intro' ? 'default' : 'ghost'} 
                  className={`w-full justify-start ${activeLesson === 'intro' ? 'bg-teal-500 hover:bg-teal-600' : ''}`}
                  onClick={() => setActiveLesson('intro')}
                >
                  <Book className="mr-2 h-4 w-4" />
                  Introduction
                </Button>
                <Button 
                  variant={activeLesson === 'basics' ? 'default' : 'ghost'} 
                  className={`w-full justify-start ${activeLesson === 'basics' ? 'bg-teal-500 hover:bg-teal-600' : ''}`}
                  onClick={() => setActiveLesson('basics')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Basic Conversations
                </Button>
                <Button 
                  variant={activeLesson === 'grammar' ? 'default' : 'ghost'} 
                  className={`w-full justify-start ${activeLesson === 'grammar' ? 'bg-teal-500 hover:bg-teal-600' : ''}`}
                  onClick={() => setActiveLesson('grammar')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Grammar Rules
                </Button>
                <Button 
                  variant={activeLesson === 'advanced' ? 'default' : 'ghost'} 
                  className={`w-full justify-start ${activeLesson === 'advanced' ? 'bg-teal-500 hover:bg-teal-600' : ''}`}
                  onClick={() => setActiveLesson('advanced')}
                >
                  <Award className="mr-2 h-4 w-4" />
                  Advanced Topics
                </Button>
                <Button 
                  variant={activeLesson === 'progress' ? 'default' : 'ghost'} 
                  className={`w-full justify-start ${activeLesson === 'progress' ? 'bg-teal-500 hover:bg-teal-600' : ''}`}
                  onClick={() => setActiveLesson('progress')}
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  My Performance
                </Button>
              </nav>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <Card className="p-6 h-full">
              {activeLesson === 'intro' && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainerVariants}
                >
                  <motion.h2 
                    className="text-2xl font-bold mb-4 text-gray-800"
                    variants={fadeInUpVariants}
                  >
                    Welcome to English AI Teacher
                  </motion.h2>
                  <motion.p 
                    className="text-gray-600 mb-6"
                    variants={fadeInUpVariants}
                  >
                    This interactive platform helps you master English through AI-powered lessons, 
                    real-time feedback, and personalized learning paths. Let's get started!
                  </motion.p>
                  
                  <motion.div 
                    className="bg-teal-50 p-6 rounded-xl mb-8 border border-teal-100"
                    variants={scaleInVariants}
                  >
                    <h3 className="text-lg font-medium text-teal-700 mb-3">How it works:</h3>
                    <motion.ul 
                      className="space-y-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.li className="flex items-start" variants={itemVariants}>
                        <ChevronRight className="h-5 w-5 text-teal-500 mr-2 mt-0.5" />
                        <span className="text-gray-700">Practice conversations with our AI tutor</span>
                      </motion.li>
                      <motion.li className="flex items-start" variants={itemVariants}>
                        <ChevronRight className="h-5 w-5 text-teal-500 mr-2 mt-0.5" />
                        <span className="text-gray-700">Get instant feedback on pronunciation and grammar</span>
                      </motion.li>
                      <motion.li className="flex items-start" variants={itemVariants}>
                        <ChevronRight className="h-5 w-5 text-teal-500 mr-2 mt-0.5" />
                        <span className="text-gray-700">Complete interactive exercises tailored to your level</span>
                      </motion.li>
                      <motion.li className="flex items-start" variants={itemVariants}>
                        <ChevronRight className="h-5 w-5 text-teal-500 mr-2 mt-0.5" />
                        <span className="text-gray-700">Track your progress across different skill areas</span>
                      </motion.li>
                    </motion.ul>
                  </motion.div>
                  
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                    variants={containerVariants}
                  >
                    <motion.div 
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      variants={popInVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                        <MessageCircle className="h-5 w-5 text-indigo-600" />
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">Interactive Conversations</h4>
                      <p className="text-sm text-gray-500">Practice real-world scenarios with our AI conversational partner</p>
                    </motion.div>
                    <motion.div 
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      variants={popInVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                        <Book className="h-5 w-5 text-amber-600" />
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">Vocabulary Builder</h4>
                      <p className="text-sm text-gray-500">Expand your vocabulary with context-based learning</p>
                    </motion.div>
                    <motion.div 
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      variants={popInVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-3">
                        <Award className="h-5 w-5 text-rose-600" />
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">Achievement System</h4>
                      <p className="text-sm text-gray-500">Earn badges and track progress to stay motivated</p>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div variants={fadeInUpVariants}>
                    <Button className="bg-teal-500 hover:bg-teal-600 px-6 py-2 transition-all duration-300 hover:px-8">
                      Start My First Lesson
                    </Button>
                  </motion.div>
                </motion.div>
              )}
              
              {activeLesson === 'progress' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">My Learning Progress</h2>
                  <p className="text-gray-600 mb-8">
                    Track your growth across different language skills. The AI analyzes your performance 
                    to identify strengths and areas for improvement.
                  </p>
                  
                  <motion.div 
                    className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      <CircularProgress value={progressValues.speaking} label="Speaking" color="#0D9488" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CircularProgress value={progressValues.listening} label="Listening" color="#6366F1" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CircularProgress value={progressValues.reading} label="Reading" color="#8B5CF6" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CircularProgress value={progressValues.writing} label="Writing" color="#EC4899" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CircularProgress value={progressValues.vocabulary} label="Vocabulary" color="#F59E0B" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CircularProgress value={progressValues.grammar} label="Grammar" color="#10B981" />
                    </motion.div>
                  </motion.div>
                  
                  <Tabs defaultValue="weekly">
                    <TabsList className="mb-4">
                      <TabsTrigger value="weekly">Weekly Report</TabsTrigger>
                      <TabsTrigger value="monthly">Monthly Progress</TabsTrigger>
                      <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    </TabsList>
                    <TabsContent value="weekly" className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-3">This Week's Highlights</h3>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-gray-700">Completed 12 conversation exercises</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-gray-700">Mastered 38 new vocabulary words</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                          <span className="text-gray-700">Need to practice past perfect tense</span>
                        </li>
                      </ul>
                      <p className="text-sm text-gray-500">Continue practicing regularly to maintain your progress!</p>
                    </TabsContent>
                    <TabsContent value="monthly" className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-3">Monthly Overview</h3>
                      <p className="text-gray-600 mb-4">Your skills have improved by 15% on average this month.</p>
                      {/* Placeholder for a monthly chart */}
                      <div className="h-40 bg-white rounded border border-gray-200 mb-4"></div>
                      <p className="text-sm text-gray-500">You've been consistently practicing for 23 days this month.</p>
                    </TabsContent>
                    <TabsContent value="achievements" className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-3">Your Achievements</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                            <Award className="h-6 w-6 text-amber-600" />
                          </div>
                          <span className="text-xs text-center text-gray-600">Perfect Week</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                            <Award className="h-6 w-6 text-purple-600" />
                          </div>
                          <span className="text-xs text-center text-gray-600">Vocabulary Master</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                            <Award className="h-6 w-6 text-gray-400" />
                          </div>
                          <span className="text-xs text-center text-gray-400">Grammar Expert (Locked)</span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
              
              {activeLesson === 'basics' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Basic Conversations</h2>
                  <p className="text-gray-600 mb-6">
                    Practice everyday conversations with our AI tutor. Type your responses or use 
                    voice input for pronunciation practice.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-start mb-4">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3 mt-1">
                        <span className="text-teal-600 text-xs font-bold">AI</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                        <p className="text-gray-700">Hello! My name is Alice. What's your name?</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-end mb-4">
                      <div className="bg-teal-500 p-3 rounded-lg shadow-sm max-w-[80%]">
                        <p className="text-white">Hi Alice, my name is John. Nice to meet you!</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ml-3 mt-1">
                        <span className="text-blue-600 text-xs font-bold">YOU</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-4">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3 mt-1">
                        <span className="text-teal-600 text-xs font-bold">AI</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                        <p className="text-gray-700">Nice to meet you too, John! Where are you from?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Textarea 
                      placeholder="Type your response..." 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button className="bg-teal-500 hover:bg-teal-600">
                      Send Response
                    </Button>
                    <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                      Voice Input
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}