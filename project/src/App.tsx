import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Github, Linkedin, Mail, ExternalLink, Command, ChevronRight, Code, Cpu, Database, MonitorDot } from 'lucide-react';

type Command = {
  command: string;
  output: React.ReactNode;
  timestamp: string;
};

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [currentPath] = useState('~');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
          <p className="text-emerald-400 font-bold text-lg mb-4">Education</p>
          <div className="space-y-2">
            <p className="text-gray-300 text-lg">Computer Science @ [Your University]</p>
            <p className="text-gray-400">Expected Graduation: [Year]</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">
                Data Structures
              </span>
              <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">
                Algorithms
              </span>
              <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-full text-sm">
                Software Engineering
              </span>
            </div>
          </div>
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
                <Github className="h-5 w-5 text-emerald-400" />
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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    handleCommand('help');
  }, []);

  const focusInput = () => {
    inputRef.current?.focus();
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

export default App;