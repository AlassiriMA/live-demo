import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
};

export type ParticleBackgroundProps = {
  count?: number; // Number of particles
  colorScheme?: 'blue' | 'purple' | 'orange' | 'green' | 'rainbow';
  speed?: 'slow' | 'medium' | 'fast';
  density?: 'low' | 'medium' | 'high';
  interactive?: boolean; // Whether particles react to mouse movement
  className?: string; // Additional styling
  size?: 'small' | 'medium' | 'large' | 'mixed';
  blur?: boolean; // Applies a blur effect to particles
  shape?: 'circle' | 'square' | 'triangle' | 'mixed';
  connectParticles?: boolean; // Whether to draw lines between nearby particles
  zIndex?: number; // Z-index of the container
};

export default function ParticleBackground({
  count = 50,
  colorScheme = 'blue',
  speed = 'medium',
  density = 'medium',
  interactive = true,
  className = '',
  size = 'mixed',
  blur = false,
  shape = 'circle',
  connectParticles = true,
  zIndex = -1,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Adjust count based on density
  const getParticleCount = useCallback(() => {
    const baseCount = count;
    switch (density) {
      case 'low': return baseCount * 0.5;
      case 'high': return baseCount * 2;
      default: return baseCount;
    }
  }, [count, density]);

  // Get color based on scheme
  const getColor = useCallback(() => {
    switch (colorScheme) {
      case 'blue':
        return `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.3})`;
      case 'purple':
        return `rgba(139, 92, 246, ${Math.random() * 0.5 + 0.3})`;
      case 'orange':
        return `rgba(249, 115, 22, ${Math.random() * 0.5 + 0.3})`;
      case 'green':
        return `rgba(16, 185, 129, ${Math.random() * 0.5 + 0.3})`;
      case 'rainbow':
        const hue = Math.floor(Math.random() * 360);
        return `hsla(${hue}, 80%, 60%, ${Math.random() * 0.5 + 0.3})`;
      default:
        return `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.3})`;
    }
  }, [colorScheme]);

  // Get particle size based on size prop
  const getSize = useCallback(() => {
    const baseSize = size === 'small' ? 2 : size === 'medium' ? 4 : 6;
    
    if (size === 'mixed') {
      return Math.random() * 5 + 1;
    }
    
    return baseSize * (Math.random() * 0.5 + 0.8); // Some variation within the size category
  }, [size]);

  // Get speed based on speed prop
  const getSpeed = useCallback(() => {
    const baseSpeed = speed === 'slow' ? 0.2 : speed === 'medium' ? 0.5 : 1;
    return (Math.random() - 0.5) * baseSpeed;
  }, [speed]);

  // Initialize particles
  const initParticles = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particleCount = getParticleCount();
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: getSize(),
        speedX: getSpeed(),
        speedY: getSpeed(),
        color: getColor(),
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    
    particlesRef.current = newParticles;
  }, [getParticleCount, getSize, getSpeed, getColor]);

  // Draw a single particle
  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.opacity;
    
    switch (shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'square':
        ctx.fillRect(
          particle.x - particle.size / 2,
          particle.y - particle.size / 2,
          particle.size,
          particle.size
        );
        break;
      case 'triangle':
        const height = particle.size * Math.sqrt(3) / 2;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y - height / 2);
        ctx.lineTo(particle.x - particle.size / 2, particle.y + height / 2);
        ctx.lineTo(particle.x + particle.size / 2, particle.y + height / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'mixed':
        const shapeType = Math.floor(Math.random() * 3);
        if (shapeType === 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (shapeType === 1) {
          ctx.fillRect(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size
          );
        } else {
          const height = particle.size * Math.sqrt(3) / 2;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y - height / 2);
          ctx.lineTo(particle.x - particle.size / 2, particle.y + height / 2);
          ctx.lineTo(particle.x + particle.size / 2, particle.y + height / 2);
          ctx.closePath();
          ctx.fill();
        }
        break;
    }
    
    ctx.globalAlpha = 1;
  }, [shape]);

  // Connect particles with lines if they're close enough
  const connectParticlesFunc = useCallback((ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    if (!connectParticles) return;
    
    const connectionDistance = 150; // Max distance to connect particles
    const opacityDecrease = 0.7; // How much the opacity decreases with distance
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          // The further apart, the more transparent
          const opacity = (1 - distance / connectionDistance) * opacityDecrease;
          
          // Use average color of two particles
          const color1 = particles[i].color;
          const color2 = particles[j].color;
          
          // Set the line style
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = colorScheme === 'rainbow' ? 
            `rgba(150, 150, 150, ${opacity})` : 
            color1;
          ctx.lineWidth = 0.5;
          
          // Draw the line
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    ctx.globalAlpha = 1;
  }, [connectParticles, colorScheme]);

  // Animation loop to update and draw particles
  const animate = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw and update each particle
    particlesRef.current.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off walls
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
      }
      
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
      }
      
      // Interactive: Move towards or away from mouse
      if (interactive && mouseRef.current.x !== -1000) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          // Repel if too close, attract if further
          const force = 0.2;
          const directionX = dx / distance;
          const directionY = dy / distance;
          
          // Repel particles
          particle.speedX -= directionX * force;
          particle.speedY -= directionY * force;
        }
      }
      
      // Draw the particle
      drawParticle(ctx, particle);
    });
    
    // Connect nearby particles
    connectParticlesFunc(ctx, particlesRef.current);
    
    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [drawParticle, connectParticlesFunc, interactive]);

  // Resize handler
  const handleResize = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    setDimensions({ width, height });
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    
    initParticles();
  }, [initParticles]);

  // Mouse move handler for interactive mode
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || !interactive) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, [interactive]);

  // Mouse leave handler
  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  // Initialize on mount
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleResize]);

  // Setup mouse events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [interactive, handleMouseMove, handleMouseLeave]);

  // Start animation
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  // Recreate particles when settings change
  useEffect(() => {
    initParticles();
  }, [colorScheme, density, size, speed, shape, count, initParticles]);

  return (
    <motion.div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ 
        zIndex, 
        filter: blur ? 'blur(1px)' : 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} />
    </motion.div>
  );
}