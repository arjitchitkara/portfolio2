import React, { useState, useEffect, useRef, memo } from 'react';
import {
  Terminal,
  Linkedin,
  Mail,
  ExternalLink,
  Command,
  ChevronRight,
  Code,
  Cpu,
  Database,
  MonitorDot,
  GraduationCap,
  Github,
} from 'lucide-react';

type Command = {
  command: string;
  output: React.ReactNode;
  timestamp: string;
};

// First, let's define our ASCII art lines
const asciiArtLines = [
  "⠀⠀⡶⠛⠲⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡶⠚⢲⡀⠀⠀",
  "⣰⠛⠃⠀⢠⣏⠀⠀⠀⠀⣀⣠⣤⣤⣤⣤⣤⣤⣤⣀⡀⠀⠀⣸⡇⠀⠈⠙⣧⠀",
  "⠸⣦⣤⣄⠀⠙⢷⣤⣶⠟⠛⢉⣁⣠⣤⣤⣤⣀⣉⠙⠻⢷⣤⡾⠋⢀⣠⣤⣴⠟",
  "⠀⠀⠀⠈⠳⣤⡾⠋⣀⣴⣿⣿⠿⠿⠟⠛⠿⠿⣿⣿⣶⣄⠙⢿⣦⠟⠁⠀⠀⠀",
  "⠀⠀⠀⢀⣾⠟⢀⣼⣿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣷⡄⠹⣷⡀⠀⠀⠀",
  "⠀⠀⠀⣾⡏⢠⣿⣿⡯⠤⠤⠤⠒⠒⠒⠒⠒⠒⠒⠤⠤⠽⣿⣿⡆⠹⣷⡀⠀⠀",
  "⠀⠀⢸⣟⣠⡿⠿⠟⠒⣒⣒⣈⣉⣉⣉⣉⣉⣉⣉⣉⣁⣒⣒⡛⠻⠿⢤⣹⣇⠀⠀",
  "⠀⠀⣾⡭⢤⣤⣠⡞⠉⠉⢀⣀⣀⠀⠀⠀⠀⢀⣀⣀⠀⠈⢹⣦⣤⡤⠴⣿⠀⠀",
  "⠀⠀⣿⡇⢸⣿⣿⣇⠀⣼⣿⣿⣿⣷⠀⠀⣼⣿⣿⣿⣷⠀⢸⣿⣿⡇⠀⣿⠀⠀",
  "⠀⠀⢻⡇⠸⣿⣿⣿⡄⢿⣿⣿⣿⡿⠀⠀⢿⣿⣿⣿⡿⢀⣿⣿⣿⡇⢸⣿⠀⠀",
  "⠀⠀⠸⣿⡀⢿⣿⣿⣿⣆⠉⠛⠋⠁⢴⣶⠀⠉⠛⠉⣠⣿⣿⣿⡿⠀⣾⠇⠀⠀",
  "⠀⠀⠀⢻⣷⡈⢻⣿⣿⣿⣿⣶⣤⣀⣈⣁⣀⡤⣴⣿⣿⣿⣿⡿⠁⣼⠟⠀⠀⠀",
  "⠀⠀⠀⢀⣽⣷⣄⠙⢿⣿⣿⡟⢲⠧⡦⠼⠤⢷⢺⣿⣿⡿⠋⣠⣾⢿⣄⠀⠀⠀",
  "⢰⠟⠛⠟⠁⣨⡿⢷⣤⣈⠙⢿⡙⠒⠓⠒⠓⠚⣹⠛⢉⣠⣾⠿⣧⡀⠙⠋⠙⣆",
  "⠹⣄⡀⠀⠐⡏⠀⠀⠉⠛⠿⣶⣿⣦⣤⣤⣤⣶⣷⡾⠟⠋⠀⠀⢸⡇⠀⢠⣤⠟",
  "⠀⠀⠳⢤⠼⠃⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠘⠷⢤⠾⠁⠀"
];

// Add type definition
type CommandOutputProps = {
  entry: Command;
  currentPath: string;
};

// Memoize the command output component
const CommandOutput = memo(({ entry, currentPath }: CommandOutputProps) => (
  <div className="space-y-3" data-command={entry.command}>
    <div className="flex items-center text-sm command-prompt">
      <span className="text-gray-500">[{entry.timestamp}]</span>
      <span className="text-emerald-400 ml-2">@portfolio</span>
      {/* <span className="text-gray-500">:</span>image.png */}
      <span className="text-blue-400">{currentPath}</span>
      <ChevronRight className="h-4 w-4 text-emerald-400 mx-1" />
      <span className="text-gray-300">{entry.command}</span>
    </div>
    <div className="ml-4">{entry.output}</div>
  </div>
));

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [currentPath] = useState('~');
  const inputRef = useRef<HTMLInputElement>(null);
  const [visibleChars, setVisibleChars] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const initialRenderRef = useRef(false);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleCommand = (cmd: string) => {
    const normalizedCmd = cmd.toLowerCase().trim();
    
    if (normalizedCmd === 'clear') {
      setHistory([]);
      return;
    }

    // If command is recognized, display its component;
    // otherwise, "Command not found".
    const output =
      commands[normalizedCmd as keyof typeof commands] || (
        <p className="text-red-400">
          Command not found. Type 'help' for available commands.
        </p>
      );

    // Always append to history
    setHistory((prev) => [...prev, {
      command: cmd,
      output,
      timestamp: getTimestamp(),
    }]);
  };

  const CommandButton = ({
    command,
    icon: Icon,
    description,
  }: {
    command: string;
    icon: any;
    description: string;
  }) => {
    const handleClick = () => {
      // Get current scroll position
      const scrollPosition = window.scrollY;
      
      handleCommand(command);
      
      // Add help menu after command
      setTimeout(() => {
        handleCommand('help');
        // After both command and help are added, scroll to the new command
        setTimeout(() => {
          const elements = document.querySelectorAll(`[data-command="${command}"]`);
          const lastElement = elements[elements.length - 1];
          if (lastElement) {
            const rect = lastElement.getBoundingClientRect();
            const absoluteTop = rect.top + window.scrollY;
            window.scrollTo({
              top: absoluteTop,
              behavior: 'smooth'
            });
          }
        }, 100);
      }, 100);
    };

    return (
      <button
        onClick={handleClick}
        className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors glow w-full text-left"
      >
        <div className="flex items-center space-x-2 mb-2">
          <Icon className="h-5 w-5 text-emerald-400" />
          <p className="text-emerald-400 font-bold">{command}</p>
        </div>
        <p className="text-gray-400 text-sm">{description}</p>
      </button>
    );
  };

  // Replace these placeholders with real info/links if needed.
  const commands = {
    help: (
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CommandButton command="about" icon={Code} description="Learn more about me" />
          <CommandButton command="projects" icon={Cpu} description="View my projects" />
          <CommandButton command="skills" icon={Database} description="See my technical skills" />
          <CommandButton command="contact" icon={Mail} description="Get my contact info" />
        </div>
      </div>
    ),
    about: (
      <div className="mt-4 space-y-4">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors glow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-emerald-400/20 flex items-center justify-center">
              <Code className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400 mb-2">Hello World! 👋</p>
              <p className="text-gray-300 leading-relaxed">
                I'm a Computer Science student passionate about software development,
                algorithms, and building innovative solutions. I love exploring new
                technologies and solving complex problems.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors glow">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-6 w-6 text-emerald-400" />
              <h2 className="text-emerald-400 font-bold text-lg">Education</h2>
            </div>
            <div className="ml-9 space-y-2">
              <p className="text-gray-200">University of Calgary</p>
              <p className="text-gray-200">Bachelor of Science in Computer Science — GPA: 3.8</p>
              <ul className="list-disc text-gray-300 ml-5 space-y-1">
                <li>Dean's List: 2022-2023, 2023-2024</li>
                <li>Computer Science Alumni Chapter Undergraduate Scholarship (2024)</li>
                <li>UCalgary Chinese Students & Scholars Association (UCCSSA) Award (2023, 2024)</li>
                <li>University of Calgary International Entrance Award (2022)</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors glow">
          <div className="flex items-center space-x-3">
            <MonitorDot className="h-6 w-6 text-emerald-400" />
            <h2 className="text-emerald-400 font-bold text-lg">Experience</h2>
          </div>
          <div className="ml-9 mt-4 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-200 font-bold">Web Developer Intern</h3>
                <span className="text-gray-400 text-sm">April 2024 - July 2024</span>
              </div>
              <p className="text-gray-300 mb-2">Indian Institute of Technology</p>
              <div className="space-y-2">
                <ul className="list-disc text-gray-300 ml-5 space-y-2">
                  <li>
                    <span className="text-emerald-400 font-medium">Situation:</span> Led the development of a React.js Weather Dashboard for real-time environmental monitoring.
                    <span className="text-emerald-400 font-medium"> Task:</span> Create an intuitive interface for displaying complex sensor data.
                    <span className="text-emerald-400 font-medium"> Action:</span> Implemented responsive UI components and real-time data visualization.
                    <span className="text-emerald-400 font-medium"> Result:</span> Achieved 100% improvement in data visibility for end-users.
                  </li>
                  <li>
                    <span className="text-emerald-400 font-medium">Challenge:</span> High server load during peak usage.
                    <span className="text-emerald-400 font-medium"> Solution:</span> Implemented Tanstack React Query for optimized data caching and state management, resulting in 30% reduced server load and improved performance.
                  </li>
                  <li>
                    <span className="text-emerald-400 font-medium">Technical Achievement:</span> Engineered efficient API integration using Axios, implementing strategic error handling and data transformation, leading to 20% faster data retrieval speeds.
                  </li>
                  <li>
                    <span className="text-emerald-400 font-medium">Impact:</span> Developed the "Comfort Zone Monitor" feature with intuitive UI/UX design principles, driving a 25% increase in user engagement and positive feedback.
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">React.js</span>
                  <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">Tanstack Query</span>
                  <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">Axios</span>
                  <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">API Integration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors glow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded bg-emerald-400/20 flex items-center justify-center">
              <Code className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-emerald-400 font-bold text-lg">Technical Skills</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="group">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                  <p className="text-emerald-300 font-medium">Languages</p>
                </div>
                <div className="flex flex-wrap gap-2 ml-4">
                  {["Java", "Python", "JavaScript", "TypeScript", "C/C++"].map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 text-sm rounded border border-gray-600 hover:border-emerald-400/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="group">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                  <p className="text-emerald-300 font-medium">Frameworks & Libraries</p>
                </div>
                <div className="flex flex-wrap gap-2 ml-4">
                  {["React", "Node.js", "Express", "Next.js", "FastAPI"].map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 text-sm rounded border border-gray-600 hover:border-emerald-400/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="group">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                  <p className="text-emerald-300 font-medium">DevOps & Cloud</p>
                </div>
                <div className="flex flex-wrap gap-2 ml-4">
                  {["Docker", "Kubernetes", "AWS", "GCP", "Cloudflare", "Redis", "Kafka"].map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 text-sm rounded border border-gray-600 hover:border-emerald-400/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    projects: (
      <div className="mt-4 space-y-4">
        {/* Crypto Exchange Project - keeping the live demo */}
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-emerald-400">Cryptocurrency Exchange Platform</h3>
            </div>
            
            <p className="text-gray-300">
              A real-time cryptocurrency trading platform inspired by Binance, featuring live market data visualization and WebSocket integration.
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className="text-gray-300 text-sm">
                  <span className="text-emerald-400/80">Situation:</span> Identified need for a user-friendly cryptocurrency trading interface with real-time data
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className="text-gray-300 text-sm">
                  <span className="text-emerald-400/80">Task:</span> Develop a comprehensive trading platform with order book visualization and market data
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className="text-gray-300 text-sm">
                  <span className="text-emerald-400/80">Action:</span> Built WebSocket integration for real-time updates, implemented dynamic routing, created proxy service
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className="text-gray-300 text-sm">
                  <span className="text-emerald-400/80">Result:</span> Achieved 100% uptime, real-time market data visualization, optimized API performance
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">Next.js 14</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">TypeScript</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">WebSocket</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">Node.js</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">TailwindCSS</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">Express</span>
            </div>

            <div className="flex space-x-4 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('https://exchange-ten-flame.vercel.app/', '_blank');
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-400/20 text-emerald-400 rounded-lg hover:bg-emerald-400/30 hover:scale-105 transition-all duration-200"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Live Demo</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('https://github.com/arjitchitkara/Exchange', '_blank');
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-400/20 text-emerald-400 rounded-lg hover:bg-emerald-400/30 hover:scale-105 transition-all duration-200"
              >
                <Github className="h-4 w-4" />
                <span>Source Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Wallet App Project */}
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-emerald-400">Secure Wallet Platform</h3>
            </div>
            
            <p className="text-gray-300">
              A modern financial platform enabling secure transactions and real-time balance tracking with zero downtime.
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className="text-gray-300 text-sm">
                  <span className="text-emerald-400/80">Situation:</span> Identified need for secure, real-time financial transactions
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className="text-gray-300 text-sm">
                  <span className="text-emerald-400/80">Task:</span> Build robust transaction processing system with PostgreSQL and Prisma
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className="text-gray-300 text-sm">
                  <span className="text-emerald-400/80">Action:</span> Implemented real-time updates, optimized deployment with Turborepo
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className="text-gray-300 text-sm">
                  <span className="text-emerald-400/80">Result:</span> 30% user engagement increase, 2,000+ monthly P2P transfers, 25% faster builds
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">TypeScript</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">Next.js</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">PostgreSQL</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">Prisma</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">Turborepo</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">TailwindCSS</span>
            </div>

            <div className="flex space-x-4 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('https://github.com/arjitchitkara/wallet.git', '_blank');
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-400/20 text-emerald-400 rounded-lg hover:bg-emerald-400/30 hover:scale-105 transition-all duration-200"
              >
                <Github className="h-4 w-4" />
                <span>Source Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Zapier Web App Project */}
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-emerald-400">Automation Platform (Zapier Clone)</h3>
            </div>
            
            <p className="text-gray-300">
              A microservices-based automation platform enabling workflow creation across applications with blockchain integration.
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className="text-gray-300 text-sm">
                  <span className="text-emerald-400/80">Situation:</span> Identified need for scalable task automation across distributed systems
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className="text-gray-300 text-sm">
                  <span className="text-emerald-400/80">Task:</span> Build a robust platform handling 20+ tasks/minute with blockchain integration
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className="text-gray-300 text-sm">
                  <span className="text-emerald-400/80">Action:</span> Implemented Redis queuing, Kafka messaging, Solana integration, and worker threads
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <p className="text-gray-300 text-sm">
                  <span className="text-emerald-400/80">Result:</span> 20% lower latency, 35% faster processing, 30% improved reliability
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">Next.js</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">TypeScript</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">Redis</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">Kafka</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">Solana</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">Prisma</span>
              <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-xs">Node.js</span>
            </div>

            <div className="flex space-x-4 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('https://github.com/arjitchitkara/Zapier.git', '_blank');
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-400/20 text-emerald-400 rounded-lg hover:bg-emerald-400/30 hover:scale-105 transition-all duration-200"
              >
                <Github className="h-4 w-4" />
                <span>Source Code</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    skills: (
      <div className="mt-4 space-y-4">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors glow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded bg-emerald-400/20 flex items-center justify-center">
              <Database className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-emerald-400 font-bold text-lg">Skills & Expertise</p>
          </div>

          <div className="space-y-6">
            <div className="group">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                <p className="text-emerald-300 font-medium">Programming Languages</p>
              </div>
              <div className="flex flex-wrap gap-2 ml-4">
                {["Java", "Python", "JavaScript", "TypeScript", "C/C++"].map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-700/50 text-gray-300 text-sm rounded border border-gray-600 hover:border-emerald-400/50 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="group">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                <p className="text-emerald-300 font-medium">Web Technologies</p>
              </div>
              <div className="flex flex-wrap gap-2 ml-4">
                {["React", "Next.js", "Node.js", "Express", "TailwindCSS", "REST APIs"].map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-700/50 text-gray-300 text-sm rounded border border-gray-600 hover:border-emerald-400/50 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="group">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                <p className="text-emerald-300 font-medium">Cloud & DevOps</p>
              </div>
              <div className="flex flex-wrap gap-2 ml-4">
                {["AWS", "Docker", "Kubernetes", "CI/CD", "GCP", "Cloudflare"].map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-700/50 text-gray-300 text-sm rounded border border-gray-600 hover:border-emerald-400/50 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="group">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                <p className="text-emerald-300 font-medium">Databases</p>
              </div>
              <div className="flex flex-wrap gap-2 ml-4">
                {["PostgreSQL", "MongoDB", "MySQL", "Redis", "Prisma"].map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-700/50 text-gray-300 text-sm rounded border border-gray-600 hover:border-emerald-400/50 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="group">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                <p className="text-emerald-300 font-medium">Tools & Others</p>
              </div>
              <div className="flex flex-wrap gap-2 ml-4">
                {["Git", "VS Code", "Postman", "Figma", "Jenkins", "Jira"].map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-700/50 text-gray-300 text-sm rounded border border-gray-600 hover:border-emerald-400/50 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    contact: (
      <div className="mt-4 space-y-4">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded bg-emerald-400/20 flex items-center justify-center">
              <Mail className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-emerald-400 font-bold text-lg">Contact Information</p>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <button
              onClick={() => window.open('mailto:arjitchitkarawork@gmail.com')}
              className="w-full group p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors shrink-0">
                  <Mail className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="font-mono text-sm break-all">arjitchitkarawork@gmail.com</span>
              </div>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => window.open('https://www.linkedin.com/in/arjitchitkara', '_blank')}
              className="w-full group p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors shrink-0">
                  <Linkedin className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="font-mono text-sm break-all">linkedin.com/in/arjitchitkara</span>
              </div>
            </button>

            {/* GitHub */}
            <button
              onClick={() => window.open('https://github.com/arjitchitkara', '_blank')}
              className="w-full group p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors shrink-0">
                  <Github className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="font-mono text-sm break-all">github.com/arjitchitkara</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    ),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCommand = input.trim();
    if (trimmedCommand) {
      handleCommand(trimmedCommand);
      setInput('');
    }
  };

  // Run "help" on every load
  useEffect(() => {
    if (!initialRenderRef.current) {
      handleCommand('help');
      initialRenderRef.current = true;
    }
  }, []);

  // Animate the ASCII art
  useEffect(() => {
    const totalChars = asciiArtLines.reduce((acc, line) => acc + line.length, 0);
    let currentChar = 0;

    const interval = setInterval(() => {
      if (currentChar < totalChars) {
        setVisibleChars((prev) => prev + 5);
        currentChar += 5;
      } else {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const getPartialArt = () => {
    let remainingChars = visibleChars;
    const lines = asciiArtLines.map((line) => {
      if (remainingChars <= 0) return '';
      const visiblePart = line.slice(0, remainingChars);
      remainingChars -= line.length;
      return visiblePart;
    });
    return lines.join('\n');
  };

  // Add a refresh function
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-mono">
      <div className="matrix-bg" />
      <div className="max-w-4xl mx-auto">
        {/* Terminal Image */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <div className="absolute inset-0 bg-emerald-400/20 rounded-lg flex items-center justify-center animate-pulse">
              <MonitorDot className="w-12 h-12 md:w-16 md:h-16 text-emerald-400" />
            </div>
            <div className="absolute inset-0 bg-emerald-400/10 rounded-lg transform rotate-45 animate-pulse delay-100" />
          </div>
        </div>

        <div className="terminal-window bg-gray-800/70 rounded-lg shadow-2xl backdrop-blur-sm border border-gray-700">
          {/* Terminal Header */}
          <div className="bg-gray-800/90 p-4 rounded-t-lg border-b border-gray-700 flex items-center">
            <div className="window-controls">
              {/* Close button, triggers refresh */}
              <div
                className="window-control close cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation(); // keep from interfering with child clicks
                  refreshPage();
                }}
              />
              <div className="window-control minimize" />
              <div className="window-control maximize" />
            </div>
            <div className="flex-1 text-center text-sm text-gray-400 flex items-center justify-center">
              <Terminal className="inline-block mr-2 h-4 w-4" />
              <span className="typing-effect">portfolio.sh</span>
            </div>
            <div className="w-20"></div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 space-y-6 min-h-[600px]" onClick={() => focusInput()}>
            <pre className="text-emerald-400 text-sm leading-tight">
              {`${getPartialArt()}

[SYSTEM] Connection established...
[SYSTEM] Terminal access granted...
[SYSTEM] Type 'help' to begin_`}
            </pre>

            <div className="flex items-center space-x-3 text-emerald-400">
              <Command className="h-6 w-6" />
              <p className="font-bold text-lg typing-effect">
                Welcome to my portfolio! Type 'help' for available commands.
              </p>
            </div>

            {history.slice(-10).map((entry, i) => (
              <CommandOutput key={i} entry={entry} currentPath={currentPath} />
            ))}

            {/* Input line */}
            <form onSubmit={handleSubmit} className="flex items-center text-sm command-prompt">
              {isLoading && <span className="animate-pulse mr-2">⚡</span>}
              <span className="text-gray-500">[{getTimestamp()}]</span>
              <span className="text-emerald-400 ml-2">@portfolio</span>
              <span className="text-gray-500">:</span>
              <span className="text-blue-400">{currentPath}</span>
              <ChevronRight className="h-4 w-4 text-emerald-400 mx-1" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-gray-300 outline-none"
                ref={inputRef}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
