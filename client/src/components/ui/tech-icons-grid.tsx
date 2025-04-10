import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import gsap from 'gsap';

// Import just the most common icons to avoid errors
import {
  SiJavascript, SiTypescript, SiReact, SiVuedotjs, SiAngular, SiNextdotjs, SiNodedotjs, 
  SiExpress, SiNestjs, SiPython, SiDjango, SiFlask, SiRuby, SiPhp, SiLaravel,
  SiGo, SiRust, SiCplusplus, SiDotnet, SiKotlin, SiSwift, 
  SiMongodb, SiPostgresql, SiMysql, SiSqlite, SiRedis, 
  SiTailwindcss, SiBootstrap, SiSass, 
  SiWebpack, SiVite, SiGit, SiGithub, SiGitlab, 
  SiDocker, SiKubernetes, SiAmazon, SiGooglecloud, 
  SiHeroku, SiNetlify, SiVercel, SiFirebase
} from 'react-icons/si';

interface TechIcon {
  icon: React.ReactNode;
  name: string;
  color: string;
}

const TechIconsGrid: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  useEffect(() => {
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    
    if (row1 && row2) {
      // Create infinite animation for first row (left to right)
      gsap.to(row1, {
        x: "-50%",
        duration: 40,
        ease: "none", 
        repeat: -1,
        yoyo: false
      });
      
      // Create infinite animation for second row (right to left)
      gsap.to(row2, {
        x: "0%",
        duration: 30,
        ease: "none", 
        repeat: -1,
        yoyo: false,
        onStart: () => {
          // Set initial position for the second row
          gsap.set(row2, { x: "-50%" });
        }
      });
    }

    return () => {
      gsap.killTweensOf(row1);
      gsap.killTweensOf(row2);
    };
  }, []);

  const techIcons: TechIcon[] = [
    { icon: <SiJavascript size={30} />, name: 'JavaScript', color: '#F7DF1E' },
    { icon: <SiTypescript size={30} />, name: 'TypeScript', color: '#3178C6' },
    { icon: <SiReact size={30} />, name: 'React', color: '#61DAFB' },
    { icon: <SiVuedotjs size={30} />, name: 'Vue.js', color: '#4FC08D' },
    { icon: <SiAngular size={30} />, name: 'Angular', color: '#DD0031' },
    { icon: <SiNextdotjs size={30} />, name: 'Next.js', color: '#000000' },
    { icon: <SiNodedotjs size={30} />, name: 'Node.js', color: '#339933' },
    { icon: <SiExpress size={30} />, name: 'Express', color: '#000000' },
    { icon: <SiNestjs size={30} />, name: 'NestJS', color: '#E0234E' },
    { icon: <SiPython size={30} />, name: 'Python', color: '#3776AB' },
    { icon: <SiDjango size={30} />, name: 'Django', color: '#092E20' },
    { icon: <SiFlask size={30} />, name: 'Flask', color: '#000000' },
    { icon: <SiRuby size={30} />, name: 'Ruby', color: '#CC342D' },
    { icon: <SiPhp size={30} />, name: 'PHP', color: '#777BB4' },
    { icon: <SiLaravel size={30} />, name: 'Laravel', color: '#FF2D20' },
    { icon: <SiGo size={30} />, name: 'Go', color: '#00ADD8' },
    { icon: <SiRust size={30} />, name: 'Rust', color: '#000000' },
    { icon: <SiCplusplus size={30} />, name: 'C++', color: '#00599C' },
    { icon: <SiDotnet size={30} />, name: 'C#/.NET', color: '#512BD4' },
    { icon: <SiKotlin size={30} />, name: 'Kotlin', color: '#7F52FF' },
    { icon: <SiSwift size={30} />, name: 'Swift', color: '#F05138' },
    { icon: <SiMongodb size={30} />, name: 'MongoDB', color: '#47A248' },
    { icon: <SiPostgresql size={30} />, name: 'PostgreSQL', color: '#4169E1' },
    { icon: <SiMysql size={30} />, name: 'MySQL', color: '#4479A1' },
    { icon: <SiSqlite size={30} />, name: 'SQLite', color: '#003B57' },
    { icon: <SiRedis size={30} />, name: 'Redis', color: '#DC382D' },
    { icon: <SiTailwindcss size={30} />, name: 'Tailwind CSS', color: '#06B6D4' },
    { icon: <SiBootstrap size={30} />, name: 'Bootstrap', color: '#7952B3' },
    { icon: <SiSass size={30} />, name: 'Sass', color: '#CC6699' },
    { icon: <SiWebpack size={30} />, name: 'Webpack', color: '#8DD6F9' },
    { icon: <SiVite size={30} />, name: 'Vite', color: '#646CFF' },
    { icon: <SiGit size={30} />, name: 'Git', color: '#F05032' },
    { icon: <SiGithub size={30} />, name: 'GitHub', color: '#181717' },
    { icon: <SiGitlab size={30} />, name: 'GitLab', color: '#FCA121' },
    { icon: <SiDocker size={30} />, name: 'Docker', color: '#2496ED' },
    { icon: <SiKubernetes size={30} />, name: 'Kubernetes', color: '#326CE5' },
    { icon: <SiAmazon size={30} />, name: 'AWS', color: '#232F3E' },
    { icon: <SiGooglecloud size={30} />, name: 'Google Cloud', color: '#4285F4' },
    { icon: <SiHeroku size={30} />, name: 'Heroku', color: '#430098' },
    { icon: <SiNetlify size={30} />, name: 'Netlify', color: '#00C7B7' },
    { icon: <SiVercel size={30} />, name: 'Vercel', color: '#000000' },
    { icon: <SiFirebase size={30} />, name: 'Firebase', color: '#FFCA28' },
  ];

  // Double the array for row 1
  const row1Icons = [...techIcons, ...techIcons];
  // Reverse order for diversity in row 2 and double it
  const row2Icons = [...techIcons.slice().reverse(), ...techIcons.slice().reverse()];

  return (
    <div className="py-10 overflow-hidden" ref={ref}>
      <motion.h2 
        className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        variants={{
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          hidden: { opacity: 0, y: 20 }
        }}
      >
        Technologies I Work With
      </motion.h2>

      {/* First row - moves left to right */}
      <div className="relative mb-12 py-4">
        <div 
          ref={row1Ref} 
          className="flex absolute whitespace-nowrap"
          style={{ width: "200%" }}
        >
          {row1Icons.map((tech, index) => (
            <div 
              key={`row1-${tech.name}-${index}`}
              className="flex flex-col items-center justify-center px-5"
            >
              <motion.div
                whileHover={{ 
                  scale: 1.2, 
                  rotate: [0, -5, 5, -5, 0],
                  transition: { duration: 0.5 }
                }}
                className="w-16 h-16 rounded-xl bg-white shadow-lg flex items-center justify-center mb-2
                           hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90"
                style={{ color: tech.color }}
              >
                {tech.icon}
              </motion.div>
              <p className="text-xs text-center font-medium text-gray-700 dark:text-gray-300 w-20">
                {tech.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Second row - moves right to left */}
      <div className="relative py-4">
        <div 
          ref={row2Ref} 
          className="flex absolute whitespace-nowrap"
          style={{ width: "200%" }}
        >
          {row2Icons.map((tech, index) => (
            <div 
              key={`row2-${tech.name}-${index}`}
              className="flex flex-col items-center justify-center px-5"
            >
              <motion.div
                whileHover={{ 
                  scale: 1.2, 
                  rotate: [0, 5, -5, 5, 0],
                  transition: { duration: 0.5 }
                }}
                className="w-16 h-16 rounded-xl bg-white shadow-lg flex items-center justify-center mb-2
                           hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90"
                style={{ color: tech.color }}
              >
                {tech.icon}
              </motion.div>
              <p className="text-xs text-center font-medium text-gray-700 dark:text-gray-300 w-20">
                {tech.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}