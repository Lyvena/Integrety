import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal as TerminalIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  projectId?: string;
  onClose?: () => void;
}

interface TerminalLine {
  content: string;
  type: "input" | "output" | "error";
  timestamp: Date;
}

export function Terminal({ projectId, onClose }: Props) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add welcome message
    setLines([
      {
        content: "Welcome to the terminal. Type 'help' for available commands.",
        type: "output",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const addLine = (content: string, type: TerminalLine["type"] = "output") => {
    setLines((prev) => [...prev, { content, type, timestamp: new Date() }]);
    // Scroll to bottom
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleCommand = async (cmd: string) => {
    addLine(`$ ${cmd}`, "input");

    const command = cmd.trim().toLowerCase();

    if (command === "help") {
      addLine(`Available commands:
- help: Show this help message
- clear: Clear the terminal
- install <package>: Install a package
- start: Start the development server
- build: Build the project
- deploy: Deploy to production`);
    } else if (command === "clear") {
      setLines([]);
    } else if (command.startsWith("install ")) {
      const pkg = command.split(" ")[1];
      addLine(`Installing ${pkg}...`);
      // TODO: Implement package installation
      setTimeout(() => {
        addLine(`Successfully installed ${pkg}`);
      }, 2000);
    } else if (command === "start") {
      addLine("Starting development server...");
      // TODO: Implement server start
      setTimeout(() => {
        addLine("Server running at http://localhost:3000");
      }, 2000);
    } else if (command === "build") {
      addLine("Building project...");
      // TODO: Implement build process
      setTimeout(() => {
        addLine("Build completed successfully!");
      }, 3000);
    } else if (command === "deploy") {
      addLine("Deploying to production...");
      // TODO: Implement deployment
      setTimeout(() => {
        addLine(
          "Deployment completed! Your app is live at https://your-app.vercel.app",
        );
      }, 4000);
    } else {
      addLine(`Command not found: ${command}`, "error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    handleCommand(input);
    setInput("");
  };

  if (isMinimized) {
    return (
      <Button
        className="fixed bottom-4 right-4 h-12 px-4"
        onClick={() => setIsMinimized(false)}
      >
        <TerminalIcon className="mr-2 h-4 w-4" />
        Terminal
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[500px] h-[400px] flex flex-col bg-black text-white border-gray-800">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsMinimized(true)}
          >
            <span className="sr-only">Minimize</span>
            <span className="h-0.5 w-3 bg-current" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <ScrollArea className="flex-1 p-4 font-mono text-sm" ref={scrollRef}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={`mb-1 ${line.type === "error" ? "text-red-400" : line.type === "input" ? "text-blue-400" : ""}`}
          >
            {line.content}
          </div>
        ))}
      </ScrollArea>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-transparent outline-none"
          placeholder="Type a command..."
          spellCheck={false}
        />
      </form>
    </Card>
  );
}
