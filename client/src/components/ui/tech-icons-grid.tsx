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
  SiHeroku, SiNetlify, SiVercel, SiFirebase
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
    { icon: <SiJavascript size={30} />, name: 'JavaScript', color: '#F7DF1E', proficiency: 95, url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { icon: <SiTypescript size={30} />, name: 'TypeScript', color: '#3178C6', proficiency: 90, url: 'https://www.typescriptlang.org/' },
    { icon: <SiReact size={30} />, name: 'React', color: '#61DAFB', proficiency: 96, url: 'https://reactjs.org/' },
    { icon: <SiVuedotjs size={30} />, name: 'Vue.js', color: '#4FC08D', proficiency: 85, url: 'https://vuejs.org/' },
    { icon: <SiAngular size={30} />, name: 'Angular', color: '#DD0031', proficiency: 80, url: 'https://angular.io/' },
    { icon: <SiNextdotjs size={30} />, name: 'Next.js', color: '#000000', proficiency: 88, url: 'https://nextjs.org/' },
    { icon: <SiNodedotjs size={30} />, name: 'Node.js', color: '#339933', proficiency: 93, url: 'https://nodejs.org/' },
    { icon: <SiExpress size={30} />, name: 'Express', color: '#000000', proficiency: 92, url: 'https://expressjs.com/' },
    { icon: <SiNestjs size={30} />, name: 'NestJS', color: '#E0234E', proficiency: 85, url: 'https://nestjs.com/' },
    { icon: <SiPython size={30} />, name: 'Python', color: '#3776AB', proficiency: 88, url: 'https://www.python.org/' },
    { icon: <SiDjango size={30} />, name: 'Django', color: '#092E20', proficiency: 82, url: 'https://www.djangoproject.com/' },
    { icon: <SiFlask size={30} />, name: 'Flask', color: '#000000', proficiency: 85, url: 'https://flask.palletsprojects.com/' },
    { icon: <SiRuby size={30} />, name: 'Ruby', color: '#CC342D', proficiency: 75, url: 'https://www.ruby-lang.org/' },
    { icon: <SiPhp size={30} />, name: 'PHP', color: '#777BB4', proficiency: 80, url: 'https://www.php.net/' },
    { icon: <SiLaravel size={30} />, name: 'Laravel', color: '#FF2D20', proficiency: 78, url: 'https://laravel.com/' },
    { icon: <SiGo size={30} />, name: 'Go', color: '#00ADD8', proficiency: 70, url: 'https://golang.org/' },
    { icon: <SiRust size={30} />, name: 'Rust', color: '#000000', proficiency: 65, url: 'https://www.rust-lang.org/' },
    { icon: <SiCplusplus size={30} />, name: 'C++', color: '#00599C', proficiency: 85, url: 'https://isocpp.org/' },
    { icon: <SiDotnet size={30} />, name: 'C#/.NET', color: '#512BD4', proficiency: 78, url: 'https://dotnet.microsoft.com/' },
    { icon: <SiKotlin size={30} />, name: 'Kotlin', color: '#7F52FF', proficiency: 72, url: 'https://kotlinlang.org/' },
    { icon: <SiSwift size={30} />, name: 'Swift', color: '#F05138', proficiency: 68, url: 'https://swift.org/' },
    { icon: <SiMongodb size={30} />, name: 'MongoDB', color: '#47A248', proficiency: 90, url: 'https://www.mongodb.com/' },
    { icon: <SiPostgresql size={30} />, name: 'PostgreSQL', color: '#4169E1', proficiency: 92, url: 'https://www.postgresql.org/' },
    { icon: <SiMysql size={30} />, name: 'MySQL', color: '#4479A1', proficiency: 88, url: 'https://www.mysql.com/' },
    { icon: <SiSqlite size={30} />, name: 'SQLite', color: '#003B57', proficiency: 87, url: 'https://www.sqlite.org/' },
    { icon: <SiRedis size={30} />, name: 'Redis', color: '#DC382D', proficiency: 83, url: 'https://redis.io/' },
    { icon: <SiTailwindcss size={30} />, name: 'Tailwind CSS', color: '#06B6D4', proficiency: 95, url: 'https://tailwindcss.com/' },
    { icon: <SiBootstrap size={30} />, name: 'Bootstrap', color: '#7952B3', proficiency: 90, url: 'https://getbootstrap.com/' },
    { icon: <SiSass size={30} />, name: 'Sass', color: '#CC6699', proficiency: 88, url: 'https://sass-lang.com/' },
    { icon: <SiWebpack size={30} />, name: 'Webpack', color: '#8DD6F9', proficiency: 85, url: 'https://webpack.js.org/' },
    { icon: <SiVite size={30} />, name: 'Vite', color: '#646CFF', proficiency: 87, url: 'https://vitejs.dev/' },
    { icon: <SiGit size={30} />, name: 'Git', color: '#F05032', proficiency: 94, url: 'https://git-scm.com/' },
    { icon: <SiGithub size={30} />, name: 'GitHub', color: '#181717', proficiency: 95, url: 'https://github.com/' },
    { icon: <SiGitlab size={30} />, name: 'GitLab', color: '#FCA121', proficiency: 85, url: 'https://about.gitlab.com/' },
    { icon: <SiDocker size={30} />, name: 'Docker', color: '#2496ED', proficiency: 88, url: 'https://www.docker.com/' },
    { icon: <SiKubernetes size={30} />, name: 'Kubernetes', color: '#326CE5', proficiency: 76, url: 'https://kubernetes.io/' },
    { icon: <SiAmazon size={30} />, name: 'AWS', color: '#232F3E', proficiency: 85, url: 'https://aws.amazon.com/' },
    { icon: <SiGooglecloud size={30} />, name: 'Google Cloud', color: '#4285F4', proficiency: 82, url: 'https://cloud.google.com/' },
    { icon: <SiHeroku size={30} />, name: 'Heroku', color: '#430098', proficiency: 88, url: 'https://www.heroku.com/' },
    { icon: <SiNetlify size={30} />, name: 'Netlify', color: '#00C7B7', proficiency: 90, url: 'https://www.netlify.com/' },
    { icon: <SiVercel size={30} />, name: 'Vercel', color: '#000000', proficiency: 92, url: 'https://vercel.com/' },
    { icon: <SiFirebase size={30} />, name: 'Firebase', color: '#FFCA28', proficiency: 87, url: 'https://firebase.google.com/' },
  ];

  // Double the array for row 1
  const row1Icons = [...techIcons, ...techIcons];
  // Reverse order for diversity in row 2 and double it
  const row2Icons = [...techIcons.slice().reverse(), ...techIcons.slice().reverse()];

  return (
    <div className="py-10 overflow-hidden" ref={ref}>


      {/* First row - moves left to right */}
      <div className="relative mb-8 py-4 h-28 bg-gray-50/50 rounded-lg overflow-hidden shadow-inner">
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
      <div className="relative py-4 h-28 bg-gray-50/50 rounded-lg overflow-hidden shadow-inner">
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
                  className="relative w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center mb-1
                             hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90 group cursor-pointer"
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