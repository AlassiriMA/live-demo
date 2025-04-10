import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import ParticleBackground from '@/components/ui/particle-background';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Define preset configurations
const presetConfigs = [
  {
    name: 'Cosmic Nebula',
    description: 'A dreamy purple cosmos with flowing particles',
    config: {
      count: 80,
      colorScheme: 'purple',
      speed: 'slow',
      density: 'medium',
      interactive: true,
      size: 'mixed',
      blur: true,
      shape: 'circle',
      connectParticles: true,
    }
  },
  {
    name: 'Digital Rain',
    description: 'Matrix-style falling green particles',
    config: {
      count: 150,
      colorScheme: 'green',
      speed: 'fast',
      density: 'high',
      interactive: false,
      size: 'small',
      blur: false,
      shape: 'square',
      connectParticles: false,
    }
  },
  {
    name: 'Sunset Glow',
    description: 'Warm orange particles that react to your movement',
    config: {
      count: 60,
      colorScheme: 'orange',
      speed: 'medium',
      density: 'low',
      interactive: true,
      size: 'large',
      blur: false,
      shape: 'circle',
      connectParticles: true,
    }
  },
  {
    name: 'Constellation',
    description: 'Star-like particles that form connected networks',
    config: {
      count: 40,
      colorScheme: 'blue',
      speed: 'slow',
      density: 'low',
      interactive: true,
      size: 'mixed',
      blur: false,
      shape: 'circle',
      connectParticles: true,
    }
  },
  {
    name: 'Rainbow Dust',
    description: 'Colorful particles floating in space',
    config: {
      count: 100,
      colorScheme: 'rainbow',
      speed: 'medium',
      density: 'medium',
      interactive: true,
      size: 'small',
      blur: true,
      shape: 'mixed',
      connectParticles: false,
    }
  },
  {
    name: 'Geometric Web',
    description: 'Connected shapes forming an abstract network',
    config: {
      count: 70,
      colorScheme: 'blue',
      speed: 'slow',
      density: 'medium',
      interactive: true,
      size: 'medium',
      blur: false,
      shape: 'triangle',
      connectParticles: true,
    }
  },
];

export default function ParticlesDemo() {
  const [selectedPreset, setSelectedPreset] = useState(presetConfigs[0]);
  const [showInfo, setShowInfo] = useState(true);

  return (
    <AppShell>
      <div className="relative min-h-screen">
        {/* Active particle background */}
        <ParticleBackground {...selectedPreset.config} />
        
        {/* Overlay content */}
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Interactive Particle Effects
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore stunning visual effects to enhance your web experience
            </p>
          </motion.div>
          
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <Card className="p-6 bg-background/80 backdrop-blur-md shadow-lg">
                <h2 className="text-2xl font-bold mb-2 text-foreground">{selectedPreset.name}</h2>
                <p className="text-muted-foreground mb-4">{selectedPreset.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {selectedPreset.config.count} particles
                  </span>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {selectedPreset.config.colorScheme}
                  </span>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {selectedPreset.config.speed} speed
                  </span>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {selectedPreset.config.shape} shape
                  </span>
                  {selectedPreset.config.interactive && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      interactive
                    </span>
                  )}
                  {selectedPreset.config.connectParticles && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      connected
                    </span>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowInfo(false)}
                  className="text-xs"
                >
                  Hide Details
                </Button>
              </Card>
            </motion.div>
          )}
          
          {!showInfo && (
            <div className="flex justify-center mb-8">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowInfo(true)}
              >
                Show Details
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presetConfigs.map((preset, index) => (
              <motion.div
                key={preset.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card 
                  className={`overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedPreset.name === preset.name 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setShowInfo(true);
                  }}
                >
                  <div className="h-32 relative">
                    <div className="absolute inset-0">
                      <ParticleBackground 
                        {...preset.config} 
                        count={Math.floor(preset.config.count / 3)} 
                        interactive={false}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{preset.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{preset.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="text-muted-foreground mb-4">
                Use the particle generator in the bottom right to create your own custom effects!
              </p>
              <Button variant="default" onClick={() => window.history.back()}>
                Back to Portfolio
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}