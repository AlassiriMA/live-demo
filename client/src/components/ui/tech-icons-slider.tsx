import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

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

export default function TechIconsSlider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    { icon: <SiDeno size={30} />, name: 'Deno', color: '#000000' },
    { icon: <SiBun size={30} />, name: 'Bun', color: '#FF5D01' },
    { icon: <SiNuxtdotjs size={30} />, name: 'Nuxt.js', color: '#00DC82' },
    { icon: <SiSvelte size={30} />, name: 'Svelte', color: '#FF3E00' },
    { icon: <SiRemix size={30} />, name: 'Remix', color: '#000000' },
    { icon: <SiPython size={30} />, name: 'Python', color: '#3776AB' },
    { icon: <SiDjango size={30} />, name: 'Django', color: '#092E20' },
    { icon: <SiFlask size={30} />, name: 'Flask', color: '#000000' },
    { icon: <SiFastapi size={30} />, name: 'FastAPI', color: '#009688' },
    { icon: <SiRuby size={30} />, name: 'Ruby', color: '#CC342D' },
    { icon: <SiRubyonrails size={30} />, name: 'Ruby on Rails', color: '#CC0000' },
    { icon: <SiPhp size={30} />, name: 'PHP', color: '#777BB4' },
    { icon: <SiLaravel size={30} />, name: 'Laravel', color: '#FF2D20' },
    { icon: <SiSymfony size={30} />, name: 'Symfony', color: '#000000' },
    { icon: <SiGo size={30} />, name: 'Go', color: '#00ADD8' },
    { icon: <SiRust size={30} />, name: 'Rust', color: '#000000' },
    { icon: <SiCplusplus size={30} />, name: 'C++', color: '#00599C' },
    { icon: <SiDotnet size={30} />, name: 'C#/.NET', color: '#512BD4' },
    { icon: <SiKotlin size={30} />, name: 'Kotlin', color: '#7F52FF' },
    { icon: <SiJupyter size={30} />, name: 'Java', color: '#007396' },
    { icon: <SiSwift size={30} />, name: 'Swift', color: '#F05138' },
    { icon: <SiDart size={30} />, name: 'Dart', color: '#0175C2' },
    { icon: <SiFlutter size={30} />, name: 'Flutter', color: '#02569B' },
    { icon: <SiMongodb size={30} />, name: 'MongoDB', color: '#47A248' },
    { icon: <SiPostgresql size={30} />, name: 'PostgreSQL', color: '#4169E1' },
    { icon: <SiMysql size={30} />, name: 'MySQL', color: '#4479A1' },
    { icon: <SiSqlite size={30} />, name: 'SQLite', color: '#003B57' },
    { icon: <SiRedis size={30} />, name: 'Redis', color: '#DC382D' },
    { icon: <SiNeo4J size={30} />, name: 'Neo4j', color: '#008CC1' },
    { icon: <SiMariadb size={30} />, name: 'MariaDB', color: '#003545' },
    { icon: <SiOracle size={30} />, name: 'Oracle', color: '#F80000' },
    { icon: <SiTailwindcss size={30} />, name: 'Tailwind CSS', color: '#06B6D4' },
    { icon: <SiBootstrap size={30} />, name: 'Bootstrap', color: '#7952B3' },
    { icon: <SiMui size={30} />, name: 'Material UI', color: '#007FFF' },
    { icon: <SiChakraui size={30} />, name: 'Chakra UI', color: '#319795' },
    { icon: <SiSass size={30} />, name: 'Sass', color: '#CC6699' },
    { icon: <SiLess size={30} />, name: 'Less', color: '#1D365D' },
    { icon: <SiStyledcomponents size={30} />, name: 'Styled Components', color: '#DB7093' },
    { icon: <SiWebpack size={30} />, name: 'Webpack', color: '#8DD6F9' },
    { icon: <SiVite size={30} />, name: 'Vite', color: '#646CFF' },
    { icon: <SiRollupjs size={30} />, name: 'Rollup', color: '#EC4A3F' },
    { icon: <SiEsbuild size={30} />, name: 'esbuild', color: '#FFCF00' },
    { icon: <SiGit size={30} />, name: 'Git', color: '#F05032' },
    { icon: <SiGithub size={30} />, name: 'GitHub', color: '#181717' },
    { icon: <SiGitlab size={30} />, name: 'GitLab', color: '#FCA121' },
    { icon: <SiBitbucket size={30} />, name: 'Bitbucket', color: '#0052CC' },
    { icon: <SiDocker size={30} />, name: 'Docker', color: '#2496ED' },
    { icon: <SiKubernetes size={30} />, name: 'Kubernetes', color: '#326CE5' },
    { icon: <SiAmazon size={30} />, name: 'AWS', color: '#232F3E' },
    { icon: <SiGooglecloud size={30} />, name: 'Google Cloud', color: '#4285F4' },
    { icon: <SiAzure size={30} />, name: 'Azure', color: '#0078D4' },
    { icon: <SiDigitalocean size={30} />, name: 'DigitalOcean', color: '#0080FF' },
    { icon: <SiHeroku size={30} />, name: 'Heroku', color: '#430098' },
    { icon: <SiNetlify size={30} />, name: 'Netlify', color: '#00C7B7' },
    { icon: <SiVercel size={30} />, name: 'Vercel', color: '#000000' },
    { icon: <SiFirebase size={30} />, name: 'Firebase', color: '#FFCA28' },
    { icon: <SiSupabase size={30} />, name: 'Supabase', color: '#3ECF8E' },
    { icon: <SiJest size={30} />, name: 'Jest', color: '#C21325' },
    { icon: <SiMocha size={30} />, name: 'Mocha', color: '#8D6748' },
    { icon: <SiCypress size={30} />, name: 'Cypress', color: '#17202C' },
    { icon: <SiSelenium size={30} />, name: 'Selenium', color: '#43B02A' },
    { icon: <SiPostman size={30} />, name: 'Postman', color: '#FF6C37' },
    { icon: <SiInsomnia size={30} />, name: 'Insomnia', color: '#4000BF' },
    { icon: <SiElectron size={30} />, name: 'Electron', color: '#47848F' },
    { icon: <SiTauri size={30} />, name: 'Tauri', color: '#FFC131' },
    { icon: <SiWeb3Dotjs size={30} />, name: 'Web3.js', color: '#F16822' },
    { icon: <SiIpfs size={30} />, name: 'IPFS', color: '#65C2CB' },
    { icon: <SiSolidity size={30} />, name: 'Solidity', color: '#363636' },
    { icon: <SiUnity size={30} />, name: 'Unity', color: '#000000' },
    { icon: <SiBlender size={30} />, name: 'Blender', color: '#F5792A' },
    { icon: <SiUbuntu size={30} />, name: 'Ubuntu', color: '#E95420' },
    { icon: <SiDebian size={30} />, name: 'Debian', color: '#A81D33' },
    { icon: <SiCentos size={30} />, name: 'CentOS', color: '#262577' },
    { icon: <SiTensorflow size={30} />, name: 'TensorFlow', color: '#FF6F00' },
    { icon: <SiPytorch size={30} />, name: 'PyTorch', color: '#EE4C2C' },
    { icon: <SiOpencv size={30} />, name: 'OpenCV', color: '#5C3EE8' },
    { icon: <SiPrisma size={30} />, name: 'Prisma', color: '#2D3748' },
    { icon: <SiGraphql size={30} />, name: 'GraphQL', color: '#E10098' },
    { icon: <SiApollographql size={30} />, name: 'Apollo GraphQL', color: '#311C87' },
    { icon: <SiSocketdotio size={30} />, name: 'Socket.io', color: '#010101' },
    { icon: <SiRabbitmq size={30} />, name: 'RabbitMQ', color: '#FF6600' },
    { icon: <SiApachekafka size={30} />, name: 'Kafka', color: '#000000' },
    { icon: <SiNginx size={30} />, name: 'Nginx', color: '#009639' },
    { icon: <SiJupyter size={30} />, name: 'Jupyter', color: '#F37626' },
    { icon: <SiLinux size={30} />, name: 'Linux', color: '#FCC624' },
    { icon: <SiWindows11 size={30} />, name: 'Windows', color: '#0078D6' },
    { icon: <SiApple size={30} />, name: 'macOS', color: '#000000' },
    { icon: <SiAndroid size={30} />, name: 'Android', color: '#3DDC84' },
    { icon: <SiIos size={30} />, name: 'iOS', color: '#000000' },
    { icon: <SiFigma size={30} />, name: 'Figma', color: '#F24E1E' },
    { icon: <SiAdobexd size={30} />, name: 'Adobe XD', color: '#FF61F6' },
    { icon: <SiSketch size={30} />, name: 'Sketch', color: '#F7B500' },
    { icon: <SiInvision size={30} />, name: 'InVision', color: '#FF3366' },
    { icon: <SiFreelancer size={30} />, name: 'Freelancer', color: '#29B2FE' },
    { icon: <SiUpwork size={30} />, name: 'Upwork', color: '#6FDA44' },
    { icon: <SiWordpress size={30} />, name: 'WordPress', color: '#21759B' },
    { icon: <SiShopify size={30} />, name: 'Shopify', color: '#7AB55C' },
    { icon: <SiWoocommerce size={30} />, name: 'WooCommerce', color: '#96588A' },
    { icon: <SiStripe size={30} />, name: 'Stripe', color: '#008CDD' },
    { icon: <SiPaypal size={30} />, name: 'PayPal', color: '#00457C' },
    { icon: <SiVisa size={30} />, name: 'Visa', color: '#1A1F71' },
    { icon: <SiMastercard size={30} />, name: 'Mastercard', color: '#EB001B' },
    { icon: <SiAmazonpay size={30} />, name: 'Amazon Pay', color: '#FF9900' },
    { icon: <SiGooglepay size={30} />, name: 'Google Pay', color: '#4285F4' },
    { icon: <SiApplepay size={30} />, name: 'Apple Pay', color: '#000000' },
    { icon: <SiGithubactions size={30} />, name: 'GitHub Actions', color: '#2088FF' },
    { icon: <SiJenkins size={30} />, name: 'Jenkins', color: '#D24939' },
    { icon: <SiCircleci size={30} />, name: 'CircleCI', color: '#343434' },
    { icon: <SiTravisci size={30} />, name: 'Travis CI', color: '#3EAAAF' },
    { icon: <SiGitlab size={30} />, name: 'GitLab CI/CD', color: '#FC6D26' },
    { icon: <SiBabel size={30} />, name: 'Babel', color: '#F9DC3E' }
  ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 10,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 8,
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 6,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
        }
      }
    ]
  };

  const reverseSliderSettings = {
    ...sliderSettings,
    rtl: true,
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="py-12 overflow-hidden">
      <div className="mb-8">
        <Slider {...sliderSettings}>
          {techIcons.map((tech, index) => (
            <div key={`${tech.name}-${index}`} className="px-4">
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div 
                  className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-2"
                  style={{ color: tech.color }}
                >
                  {tech.icon}
                </div>
                <p className="text-xs text-center font-medium text-gray-700 dark:text-gray-300 truncate w-20">
                  {tech.name}
                </p>
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>

      <div>
        <Slider {...reverseSliderSettings}>
          {techIcons.slice().reverse().map((tech, index) => (
            <div key={`${tech.name}-rev-${index}`} className="px-4">
              <motion.div
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div 
                  className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-2"
                  style={{ color: tech.color }}
                >
                  {tech.icon}
                </div>
                <p className="text-xs text-center font-medium text-gray-700 dark:text-gray-300 truncate w-20">
                  {tech.name}
                </p>
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}