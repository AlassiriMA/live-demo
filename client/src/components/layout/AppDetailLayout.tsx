import { ReactNode } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import AppShell from "./AppShell";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { AppInfo } from "@/lib/app-data";

interface AppDetailLayoutProps {
  app: AppInfo;
  children: ReactNode;
}

export default function AppDetailLayout({ app, children }: AppDetailLayoutProps) {
  return (
    <AppShell>
      {/* Header with app info */}
      <div 
        className="py-16"
        style={{ 
          backgroundColor: `${app.primaryColor}10`, 
          borderBottom: `1px solid ${app.primaryColor}30` 
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mr-2 hover:bg-white/20"
            >
              <Link href="/">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Apps
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <motion.div 
              className="md:w-1/3 mb-6 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div 
                className="rounded-xl overflow-hidden shadow-lg border"
                style={{ borderColor: `${app.primaryColor}30` }}
              >
                <img 
                  src={app.imageUrl} 
                  alt={app.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </motion.div>

            <motion.div 
              className="md:w-2/3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h1 
                  className="text-3xl md:text-4xl font-bold font-heading mb-2 md:mb-0"
                  style={{ color: app.primaryColor }}
                >
                  {app.name}
                </h1>
                <div className="flex gap-2 flex-wrap">
                  {app.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-sm font-medium rounded-full"
                      style={{ 
                        backgroundColor: `${app.primaryColor}15`,
                        color: app.primaryColor
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                {app.description}
              </p>
              <Button
                className="shadow-md"
                style={{ 
                  backgroundColor: app.primaryColor,
                  color: "white"
                }}
                asChild
              >
                <Link href={app.route}>Launch App</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </div>
    </AppShell>
  );
}