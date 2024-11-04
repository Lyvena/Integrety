import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import brain from "brain";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AIProvider } from "types";

type ProjectContext = {
  name: string;
  type: "web3" | "ai" | "fullstack";
  framework?: string;
  description?: string;
};

type Message = {
  content: string;
  isUser: boolean;
  timestamp: Date;
};

type ChatProps = {
  className?: string;
  projectId: string;
  context?: ProjectContext;
  onCodeGenerated: (code: string) => void;
};

export function Chat({
  className = "",
  projectId,
  context,
  onCodeGenerated,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<AIProvider>("openai");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const apiKey = localStorage.getItem(`${selectedProvider}_api_key`);
    if (!apiKey) {
      toast.error(
        `Please set your ${selectedProvider.toUpperCase()} API key first`,
      );
      return;
    }

    // Enhance the prompt with project context
    let enhancedInput = input;
    if (context) {
      enhancedInput = `Project Context:\nType: ${context.type}\n${context.framework ? `Framework: ${context.framework}\n` : ""}${context.description ? `Description: ${context.description}\n` : ""}\nUser Query: ${input}`;
    }

    const userMessage: Message = {
      content: input, // Show original input to user
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await brain.chat({
        provider: selectedProvider,
        message: enhancedInput,
        api_key: apiKey,
      });
      const data = await response.json();

      const aiMessage: Message = {
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      // Check if the response contains code and notify parent
      const codeMatch = data.response.match(/```[\s\S]*?```/);
      if (codeMatch) {
        const code = codeMatch[0].replace(/```[^\n]*\n?|```$/g, "");
        onCodeGenerated(code);
      }

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground pt-8">
            I can help you develop Web3 and AI applications! Ask me about smart
            contracts, AI integration, or full-stack development.
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 block mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t space-y-2">
        <div className="flex gap-2">
          <Select
            value={selectedProvider}
            onValueChange={(value: AIProvider) => setSelectedProvider(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select AI Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI GPT-4</SelectItem>
              <SelectItem value="anthropic">Anthropic Claude</SelectItem>
              <SelectItem value="grok">xAI Grok</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              const key = prompt(
                `Enter your ${selectedProvider.toUpperCase()} API key:`,
              );
              if (key) {
                localStorage.setItem(`${selectedProvider}_api_key`, key);
                toast.success(
                  `${selectedProvider.toUpperCase()} API key saved!`,
                );
              }
            }}
          >
            Set API Key
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
