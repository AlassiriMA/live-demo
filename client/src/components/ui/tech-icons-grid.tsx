import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import gsap from 'gsap';
import { CircularProgress } from '@/components/ui/circular-progress';

// Import just the most common icons to avoid errors
import {
  SiJavascript, SiTypescript, SiReact, SiVuedotjs, SiAngular, SiNextdotjs, SiNodedotjs, 
  SiExpress, SiNestjs, SiPython, SiDjango, SiFlask, SiRuby, SiPhp, SiLaravel,
  SiGo, SiRust, SiCplusplus, SiDotnet, SiKotlin, SiSwift, 
  SiMongodb, SiPostgresql, SiMysql, SiSqlite, SiRedis, 
  SiTailwindcss, SiBootstrap, SiSass, 
  SiWebpack, SiVite, SiGit, SiGithub, SiGitlab, 
  SiDocker, SiKubernetes, SiAmazon, SiGooglecloud, 
  SiHeroku, SiNetlify, SiVercel, SiFirebase, SiTensorflow, SiPytorch, SiOpenai,
  SiHuggingface, SiScikitlearn, SiJupyter, SiKeras, SiPandas, SiNumpy
} from 'react-icons/si';

interface TechIcon {
  icon: React.ReactNode;
  name: string;
  color: string;
  proficiency: number; // Experience level as a percentage
  url: string; // URL to the technology's website
}

export default function TechIconsGrid() {
  const controls = useAnimation();
  const ref = useRef(null);
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
      // Set initial position for the second row
      gsap.set(row2, { x: "-50%" });
      
      // Create infinite animation for first row (left to right)
      gsap.to(row1, {
        x: "-50%",
        duration: 40,
        ease: "linear", 
        repeat: -1,
        yoyo: false
      });
      
      // Create infinite animation for second row (right to left)
      gsap.to(row2, {
        x: "0%",
        duration: 30,
        ease: "linear", 
        repeat: -1,
        yoyo: false
      });
    }

    return () => {
      gsap.killTweensOf(row1);
      gsap.killTweensOf(row2);
    };
  }, []);

  const techIcons: TechIcon[] = [
    // Programming Languages
    { icon: <SiJavascript size={38} />, name: 'JavaScript', color: '#F7DF1E', proficiency: 95, url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { icon: <SiTypescript size={38} />, name: 'TypeScript', color: '#3178C6', proficiency: 90, url: 'https://www.typescriptlang.org/' },
    { icon: <SiPython size={38} />, name: 'Python', color: '#3776AB', proficiency: 92, url: 'https://www.python.org/' },
    { icon: <SiRuby size={38} />, name: 'Ruby', color: '#CC342D', proficiency: 75, url: 'https://www.ruby-lang.org/' },
    { icon: <SiPhp size={38} />, name: 'PHP', color: '#777BB4', proficiency: 80, url: 'https://www.php.net/' },
    { icon: <SiGo size={38} />, name: 'Go', color: '#00ADD8', proficiency: 70, url: 'https://golang.org/' },
    { icon: <SiRust size={38} />, name: 'Rust', color: '#000000', proficiency: 65, url: 'https://www.rust-lang.org/' },
    { icon: <SiCplusplus size={38} />, name: 'C++', color: '#00599C', proficiency: 85, url: 'https://isocpp.org/' },
    { icon: <SiDotnet size={38} />, name: 'C#/.NET', color: '#512BD4', proficiency: 78, url: 'https://dotnet.microsoft.com/' },
    { icon: <SiKotlin size={38} />, name: 'Kotlin', color: '#7F52FF', proficiency: 72, url: 'https://kotlinlang.org/' },
    { icon: <SiSwift size={38} />, name: 'Swift', color: '#F05138', proficiency: 68, url: 'https://swift.org/' },
    
    // Frontend 
    { icon: <SiReact size={38} />, name: 'React', color: '#61DAFB', proficiency: 96, url: 'https://reactjs.org/' },
    { icon: <SiVuedotjs size={38} />, name: 'Vue.js', color: '#4FC08D', proficiency: 85, url: 'https://vuejs.org/' },
    { icon: <SiAngular size={38} />, name: 'Angular', color: '#DD0031', proficiency: 80, url: 'https://angular.io/' },
    { icon: <SiNextdotjs size={38} />, name: 'Next.js', color: '#000000', proficiency: 88, url: 'https://nextjs.org/' },
    { icon: <SiTailwindcss size={38} />, name: 'Tailwind CSS', color: '#06B6D4', proficiency: 95, url: 'https://tailwindcss.com/' },
    { icon: <SiBootstrap size={38} />, name: 'Bootstrap', color: '#7952B3', proficiency: 90, url: 'https://getbootstrap.com/' },
    { icon: <SiSass size={38} />, name: 'Sass', color: '#CC6699', proficiency: 88, url: 'https://sass-lang.com/' },
    
    // Backend
    { icon: <SiNodedotjs size={38} />, name: 'Node.js', color: '#339933', proficiency: 93, url: 'https://nodejs.org/' },
    { icon: <SiExpress size={38} />, name: 'Express', color: '#000000', proficiency: 92, url: 'https://expressjs.com/' },
    { icon: <SiNestjs size={38} />, name: 'NestJS', color: '#E0234E', proficiency: 85, url: 'https://nestjs.com/' },
    { icon: <SiDjango size={38} />, name: 'Django', color: '#092E20', proficiency: 86, url: 'https://www.djangoproject.com/' },
    { icon: <SiFlask size={38} />, name: 'Flask', color: '#000000', proficiency: 88, url: 'https://flask.palletsprojects.com/' },
    { icon: <SiLaravel size={38} />, name: 'Laravel', color: '#FF2D20', proficiency: 78, url: 'https://laravel.com/' },
    
    // Database
    { icon: <SiMongodb size={38} />, name: 'MongoDB', color: '#47A248', proficiency: 90, url: 'https://www.mongodb.com/' },
    { icon: <SiPostgresql size={38} />, name: 'PostgreSQL', color: '#4169E1', proficiency: 92, url: 'https://www.postgresql.org/' },
    { icon: <SiMysql size={38} />, name: 'MySQL', color: '#4479A1', proficiency: 88, url: 'https://www.mysql.com/' },
    { icon: <SiSqlite size={38} />, name: 'SQLite', color: '#003B57', proficiency: 87, url: 'https://www.sqlite.org/' },
    { icon: <SiRedis size={38} />, name: 'Redis', color: '#DC382D', proficiency: 83, url: 'https://redis.io/' },
    
    // AI/ML Technologies
    { icon: <SiTensorflow size={38} />, name: 'TensorFlow', color: '#FF6F00', proficiency: 88, url: 'https://www.tensorflow.org/' },
    { icon: <SiPytorch size={38} />, name: 'PyTorch', color: '#EE4C2C', proficiency: 86, url: 'https://pytorch.org/' },
    { icon: <SiOpenai size={38} />, name: 'OpenAI', color: '#412991', proficiency: 90, url: 'https://openai.com/' },
    { icon: <SiHuggingface size={38} />, name: 'Hugging Face', color: '#FFD21E', proficiency: 84, url: 'https://huggingface.co/' },
    { icon: <SiScikitlearn size={38} />, name: 'scikit-learn', color: '#F7931E', proficiency: 89, url: 'https://scikit-learn.org/' },
    { icon: <SiJupyter size={38} />, name: 'Jupyter', color: '#F37626', proficiency: 92, url: 'https://jupyter.org/' },
    { icon: <SiKeras size={38} />, name: 'Keras', color: '#D00000', proficiency: 85, url: 'https://keras.io/' },
    { icon: <SiPandas size={38} />, name: 'Pandas', color: '#150458', proficiency: 93, url: 'https://pandas.pydata.org/' },
    { icon: <SiNumpy size={38} />, name: 'NumPy', color: '#013243', proficiency: 94, url: 'https://numpy.org/' },
    
    // DevOps & Tools
    { icon: <SiWebpack size={38} />, name: 'Webpack', color: '#8DD6F9', proficiency: 85, url: 'https://webpack.js.org/' },
    { icon: <SiVite size={38} />, name: 'Vite', color: '#646CFF', proficiency: 87, url: 'https://vitejs.dev/' },
    { icon: <SiGit size={38} />, name: 'Git', color: '#F05032', proficiency: 94, url: 'https://git-scm.com/' },
    { icon: <SiGithub size={38} />, name: 'GitHub', color: '#181717', proficiency: 95, url: 'https://github.com/' },
    { icon: <SiGitlab size={38} />, name: 'GitLab', color: '#FCA121', proficiency: 85, url: 'https://about.gitlab.com/' },
    { icon: <SiDocker size={38} />, name: 'Docker', color: '#2496ED', proficiency: 88, url: 'https://www.docker.com/' },
    { icon: <SiKubernetes size={38} />, name: 'Kubernetes', color: '#326CE5', proficiency: 76, url: 'https://kubernetes.io/' },
    
    // Cloud Services
    { icon: <SiAmazon size={38} />, name: 'AWS', color: '#232F3E', proficiency: 85, url: 'https://aws.amazon.com/' },
    { icon: <SiGooglecloud size={38} />, name: 'Google Cloud', color: '#4285F4', proficiency: 82, url: 'https://cloud.google.com/' },
    { icon: <SiHeroku size={38} />, name: 'Heroku', color: '#430098', proficiency: 88, url: 'https://www.heroku.com/' },
    { icon: <SiNetlify size={38} />, name: 'Netlify', color: '#00C7B7', proficiency: 90, url: 'https://www.netlify.com/' },
    { icon: <SiVercel size={38} />, name: 'Vercel', color: '#000000', proficiency: 92, url: 'https://vercel.com/' },
    { icon: <SiFirebase size={38} />, name: 'Firebase', color: '#FFCA28', proficiency: 87, url: 'https://firebase.google.com/' },
  ];

  // Double the array for row 1
  const row1Icons = [...techIcons, ...techIcons];
  // Reverse order for diversity in row 2 and double it
  const row2Icons = [...techIcons.slice().reverse(), ...techIcons.slice().reverse()];

  return (
    <div className="py-10 overflow-hidden" ref={ref}>


      {/* First row - moves left to right */}
      <div className="relative mb-8 py-4 h-36 bg-gray-50/50 rounded-lg overflow-hidden shadow-inner">
        <div 
          ref={row1Ref} 
          className="flex absolute whitespace-nowrap"
          style={{ width: "200%" }}
        >
          {row1Icons.map((tech, index) => (
            <div 
              key={`row1-${tech.name}-${index}`}
              className="flex flex-col items-center justify-center px-4"
            >
              <a 
                href={tech.url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => {
                  // Prevent the default behavior when inside an animation container
                  e.stopPropagation();
                }}
                aria-label={`Visit ${tech.name} website`}
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: [0, -5, 5, -5, 0],
                    transition: { duration: 0.5 }
                  }}
                  className="relative w-16 h-16 rounded-full bg-transparent shadow-md flex items-center justify-center mb-1
                             hover:shadow-xl transition-all duration-300 backdrop-blur-sm group cursor-pointer"
                  style={{ color: tech.color }}
                >
                  {tech.icon}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-white bg-opacity-95 z-10">
                    <CircularProgress 
                      value={tech.proficiency} 
                      color={tech.color}
                      size={50}
                      strokeWidth={3}
                    />
                  </div>
                </motion.div>
              </a>
              <p className="text-[10px] text-center font-medium text-gray-700 dark:text-gray-300 w-16 truncate">
                {tech.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Second row - moves right to left */}
      <div className="relative py-4 h-36 bg-gray-50/50 rounded-lg overflow-hidden shadow-inner">
        <div 
          ref={row2Ref} 
          className="flex absolute whitespace-nowrap"
          style={{ width: "200%" }}
        >
          {row2Icons.map((tech, index) => (
            <div 
              key={`row2-${tech.name}-${index}`}
              className="flex flex-col items-center justify-center px-4"
            >
              <a 
                href={tech.url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => {
                  // Prevent the default behavior when inside an animation container
                  e.stopPropagation();
                }}
                aria-label={`Visit ${tech.name} website`}
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: [0, 5, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                  className="relative w-16 h-16 rounded-full bg-transparent shadow-md flex items-center justify-center mb-1
                             hover:shadow-xl transition-all duration-300 backdrop-blur-sm group cursor-pointer"
                  style={{ color: tech.color }}
                >
                  {tech.icon}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-white bg-opacity-95 z-10">
                    <CircularProgress 
                      value={tech.proficiency} 
                      color={tech.color}
                      size={50}
                      strokeWidth={3}
                    />
                  </div>
                </motion.div>
              </a>
              <p className="text-[10px] text-center font-medium text-gray-700 dark:text-gray-300 w-16 truncate">
                {tech.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}