import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Linkedin, Mail, ExternalLink, Command, ChevronRight, Code, Cpu, Database, MonitorDot, GraduationCap } from 'lucide-react';

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
  "⠀⠀⢸⣟⣠⡿⠿⠟⠒⣒⣒⣈⣉⣉⣉⣉⣉⣉⣉⣁⣒⣒⡛⠻⠿⢤⣹⣇⠀⠀",
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

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [currentPath] = useState('~');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [visibleChars, setVisibleChars] = useState<number>(0);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const CommandButton = ({ command, icon: Icon, description }: { command: string; icon: any; description: string }) => (
    <button
      onClick={() => handleCommand(command)}
      className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors glow w-full text-left"
    >
      <div className="flex items-center space-x-2 mb-2">
        <Icon className="h-5 w-5 text-emerald-400" />
        <p className="text-emerald-400 font-bold">{command}</p>
      </div>
      <p className="text-gray-400 text-sm">{description}</p>
    </button>
  );

  const commands = {
    help: (
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CommandButton command="about" icon={Code} description="Learn more about me" />
          <CommandButton command="projects" icon={Cpu} description="View my projects" />
          <CommandButton command="skills" icon={Database} description="See my technical skills" />
          <CommandButton command="education" icon={GraduationCap} description="View my educational background" />
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
          <p className="text-emerald-400 font-bold text-lg mb-4">Technologies</p>
          {/* ... rest of technologies section ... */}
        </div>
      </div>
    ),
    projects: (
      <div className="mt-4 space-y-4">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-lg font-bold text-emerald-400">Project 1</p>
            </div>
            <ExternalLink className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-gray-300 mb-4">Description of your first project with detailed explanation of the technologies used and problems solved.</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">React</span>
            <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">Node.js</span>
            <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">MongoDB</span>
          </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                <Database className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-lg font-bold text-emerald-400">Project 2</p>
            </div>
            <ExternalLink className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-gray-300 mb-4">Description of your second project showcasing your expertise in machine learning and data analysis.</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">Python</span>
            <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">TensorFlow</span>
            <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">Flask</span>
          </div>
        </div>
      </div>
    ),
    skills: (
      <div className="mt-4 space-y-4">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors glow">
          <p className="text-emerald-400 font-bold text-lg mb-4">Languages</p>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-emerald-400/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">JavaScript</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-emerald-400/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">TypeScript</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-emerald-400/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Python</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors glow">
          <p className="text-emerald-400 font-bold text-lg mb-4">Technologies</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="px-4 py-2 bg-emerald-400/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">React</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-emerald-400/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Node.js</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-emerald-400/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">MongoDB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    contact: (
      <div className="mt-4">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-emerald-400/50 transition-colors glow">
          <div className="space-y-4">
            <a 
              href="mailto:your.email@example.com"
              className="flex items-center space-x-3 text-gray-300 hover:text-emerald-400 transition-colors group p-3 rounded-lg hover:bg-emerald-400/10"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors">
                <Mail className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="font-mono">your.email@example.com</span>
            </a>
            <a 
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-gray-300 hover:text-emerald-400 transition-colors group p-3 rounded-lg hover:bg-emerald-400/10"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors">
                <GithubIcon />
              </div>
              <span className="font-mono">github.com/yourusername</span>
            </a>
            <a 
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-gray-300 hover:text-emerald-400 transition-colors group p-3 rounded-lg hover:bg-emerald-400/10"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/30 transition-colors">
                <Linkedin className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="font-mono">linkedin.com/in/yourusername</span>
            </a>
          </div>
        </div>
      </div>
    ),
  };

  const handleCommand = (cmd: string) => {
    const normalizedCmd = cmd.toLowerCase().trim();
    
    if (normalizedCmd === 'clear') {
      setHistory([]);
      return;
    }

    const output = commands[normalizedCmd as keyof typeof commands] || (
      <p className="text-red-400">Command not found. Type 'help' for available commands.</p>
    );

    setHistory(prev => [...prev, { 
      command: cmd, 
      output,
      timestamp: getTimestamp()
    }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    handleCommand(input);
    setInput('');
  };

  useEffect(() => {
    // Small delay to ensure content is rendered before scrolling
    const timeoutId = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [history]);

  useEffect(() => {
    const initialRender = sessionStorage.getItem('initialRender');
    if (!initialRender) {
      handleCommand('help');
      sessionStorage.setItem('initialRender', 'true');
    }
  }, []);

  useEffect(() => {
    const totalChars = asciiArtLines.reduce((acc, line) => acc + line.length, 0);
    let currentChar = 0;
    
    const interval = setInterval(() => {
      if (currentChar < totalChars) {
        setVisibleChars(prev => prev + 3);
        currentChar += 3;
      } else {
        clearInterval(interval);
        // Scroll to bottom when animation completes
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 5);

    return () => clearInterval(interval);
  }, []);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const getPartialArt = () => {
    let remainingChars = visibleChars;
    const lines = asciiArtLines.map(line => {
      if (remainingChars <= 0) return "";
      const visiblePart = line.slice(0, remainingChars);
      remainingChars -= line.length;
      return visiblePart;
    });

    return lines.join('\n');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-mono" onClick={focusInput}>
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
              <div className="window-control close" />
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
          <div className="p-6 space-y-6 min-h-[600px] max-h-[80vh] overflow-y-auto">
            <pre className="text-emerald-400 text-sm leading-tight">
              {`${getPartialArt()}

[SYSTEM] Connection established...
[SYSTEM] Terminal access granted...
[SYSTEM] Type 'help' to begin_`}
            </pre>
            <div className="flex items-center space-x-3 text-emerald-400">
              <Command className="h-6 w-6" />
              <p className="font-bold text-lg typing-effect">Welcome to my portfolio! Type 'help' for available commands.</p>
            </div>
            
            {history.map((entry, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center text-sm command-prompt">
                  <span className="text-gray-500">[{entry.timestamp}]</span>
                  <span className="text-emerald-400 ml-2">guest@portfolio</span>
                  <span className="text-gray-500">:</span>
                  <span className="text-blue-400">{currentPath}</span>
                  <ChevronRight className="h-4 w-4 text-emerald-400 mx-1" />
                  <span className="text-gray-300">{entry.command}</span>
                </div>
                <div className="ml-4">{entry.output}</div>
              </div>
            ))}

            <form onSubmit={handleSubmit} className="flex items-center text-sm command-prompt">
              <span className="text-gray-500">[{getTimestamp()}]</span>
              <span className="text-emerald-400 ml-2">guest@portfolio</span>
              <span className="text-gray-500">:</span>
              <span className="text-blue-400">{currentPath}</span>
              <ChevronRight className="h-4 w-4 text-emerald-400 mx-1" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-300"
                autoFocus
              />
            </form>
          </div>
        </div>
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export default App;