import { useState } from 'react';
import ParticleBackground, { ParticleBackgroundProps } from './particle-background';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowDown, ArrowUp, Save, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ParticleGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ParticleBackgroundProps>({
    count: 60,
    colorScheme: 'blue',
    speed: 'medium',
    density: 'medium',
    interactive: true,
    size: 'mixed',
    blur: false,
    shape: 'circle',
    connectParticles: true,
  });

  const handleChange = (key: keyof ParticleBackgroundProps, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const getRandomConfig = () => {
    const colorSchemes = ['blue', 'purple', 'orange', 'green', 'rainbow'] as const;
    const speeds = ['slow', 'medium', 'fast'] as const;
    const densities = ['low', 'medium', 'high'] as const;
    const sizes = ['small', 'medium', 'large', 'mixed'] as const;
    const shapes = ['circle', 'square', 'triangle', 'mixed'] as const;

    setConfig({
      count: Math.floor(Math.random() * 100) + 20,
      colorScheme: colorSchemes[Math.floor(Math.random() * colorSchemes.length)],
      speed: speeds[Math.floor(Math.random() * speeds.length)],
      density: densities[Math.floor(Math.random() * densities.length)],
      interactive: Math.random() > 0.3, // 70% chance of being interactive
      size: sizes[Math.floor(Math.random() * sizes.length)],
      blur: Math.random() > 0.7, // 30% chance of being blurred
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      connectParticles: Math.random() > 0.4, // 60% chance of connecting particles
    });
  };

  return (
    <>
      <ParticleBackground {...config} zIndex={-1} />
      
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <Button 
            onClick={() => setIsOpen(!isOpen)} 
            className="rounded-full h-12 w-12 bg-primary/80 backdrop-blur-sm shadow-lg hover:bg-primary"
          >
            <Sparkles className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="fixed bottom-20 right-4 w-80 z-50"
          >
            <Card className="p-4 shadow-xl bg-background/90 backdrop-blur-md border-primary/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Particle Generator</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="count">Particle Count: {config.count}</Label>
                  </div>
                  <Slider
                    id="count"
                    min={10}
                    max={200}
                    step={5}
                    value={[config.count || 50]}
                    onValueChange={(value) => handleChange('count', value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="colorScheme">Color Scheme</Label>
                  <Select
                    value={config.colorScheme}
                    onValueChange={(value) => handleChange('colorScheme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="rainbow">Rainbow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="speed">Speed</Label>
                  <Select
                    value={config.speed}
                    onValueChange={(value) => handleChange('speed', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="fast">Fast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="density">Density</Label>
                  <Select
                    value={config.density}
                    onValueChange={(value) => handleChange('density', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select density" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="size">Particle Size</Label>
                  <Select
                    value={config.size}
                    onValueChange={(value) => handleChange('size', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shape">Particle Shape</Label>
                  <Select
                    value={config.shape}
                    onValueChange={(value) => handleChange('shape', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="triangle">Triangle</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="interactive"
                    checked={config.interactive}
                    onCheckedChange={(checked) => handleChange('interactive', checked)}
                  />
                  <Label htmlFor="interactive">Interactive</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="connectParticles"
                    checked={config.connectParticles}
                    onCheckedChange={(checked) => handleChange('connectParticles', checked)}
                  />
                  <Label htmlFor="connectParticles">Connect Particles</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="blur"
                    checked={config.blur}
                    onCheckedChange={(checked) => handleChange('blur', checked)}
                  />
                  <Label htmlFor="blur">Blur Effect</Label>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    onClick={getRandomConfig}
                    variant="outline"
                    className="flex-1 mr-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Random
                  </Button>
                  <Button 
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}