import { Chat } from "@/components/Chat";
import { Preview } from "@/components/Preview";
import { Terminal } from "@/components/Terminal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import brain from "brain";
import { Terminal as TerminalIcon } from "lucide-react";
import {
  ArrowLeft,
  History as HistoryIcon,
  Loader2,
  Rocket,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { ApiKeyInput } from "@/components/ApiKeyInput";
import { DeployDialog } from "@/components/DeployDialog";
import { Footer } from "@/components/Footer";
import { History, saveToHistory } from "@/components/History";
import { Navigation } from "@/components/Navigation";

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState<"web3" | "ai" | "fullstack">("web3");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [setupInstructions, setSetupInstructions] = useState("");
  const [explanation, setExplanation] = useState("");
  const [showDeploy, setShowDeploy] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const [currentProject, setCurrentProject] = useState<any>(null);

  useEffect(() => {
    const apiKey = localStorage.getItem("openai_api_key");
    setHasApiKey(!!apiKey);

    // Load project if projectId is provided
    if (projectId) {
      const savedProjects = localStorage.getItem(
        `projects_${localStorage.getItem("user_email")}`,
      );
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const project = projects.find((p: any) => p.id === projectId);
        if (project) {
          setCurrentProject(project);
          setPrompt(project.prompt || "");
          setLanguage(project.language || "mojo");
          setGeneratedCode(project.code || "");
          setSetupInstructions(project.setupInstructions || "");
          setExplanation(project.explanation || "");
        }
      }
    }
  }, [projectId]);

  const handleApiKeySubmit = (apiKey: string) => {
    localStorage.setItem("openai_api_key", apiKey);
    setHasApiKey(true);
    toast.success("API key saved successfully!");
  };

  const handleHistorySelect = (entry: any) => {
    setPrompt(entry.prompt);
    setLanguage(entry.language);
    setGeneratedCode(entry.code);
    setSetupInstructions(entry.setupInstructions || "");
    setExplanation(entry.explanation || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const apiKey = localStorage.getItem("openai_api_key");
      if (!apiKey) {
        toast.error("Please set your OpenAI API key first");
        return;
      }

      const response = await brain.generate_code({
        api_key: apiKey,
        prompt,
        language,
      });
      const data = await response.json();
      const code = data.code;
      const setupInstructions = data.setup_instructions || "";
      const explanation = data.explanation || "";

      setGeneratedCode(code);
      setSetupInstructions(setupInstructions);
      setExplanation(explanation);

      // Update project if we're in a project
      if (currentProject) {
        const savedProjects = localStorage.getItem(
          `projects_${localStorage.getItem("user_email")}`,
        );
        if (savedProjects) {
          const projects = JSON.parse(savedProjects);
          const updatedProjects = projects.map((p: any) =>
            p.id === currentProject.id
              ? {
                  ...p,
                  code,
                  prompt,
                  language,
                  setupInstructions,
                  explanation,
                  updatedAt: new Date(),
                }
              : p,
          );
          localStorage.setItem(
            `projects_${localStorage.getItem("user_email")}`,
            JSON.stringify(updatedProjects),
          );
        }
      }

      // Save to history
      saveToHistory({
        language,
        prompt,
        code,
        setupInstructions,
        explanation,
      });
      toast.success("Code generated successfully!");
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("Failed to generate code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Navigation />
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Generate Code</h1>
            <div className="flex items-center space-x-2">
              <ApiKeyInput
                onApiKeySubmit={handleApiKeySubmit}
                hasApiKey={hasApiKey}
              />
              <History onSelect={handleHistorySelect} />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDeploy(true)}
                disabled={!generatedCode || !currentProject}
                title={
                  !currentProject ? "Save as project first" : "Deploy project"
                }
              >
                <Rocket className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowTerminal(true)}
              >
                <TerminalIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DeployDialog
            open={showDeploy}
            onOpenChange={setShowDeploy}
            projectId={projectId || undefined}
          />

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Chat Section */}
            {currentProject && (
              <div className="lg:col-span-12 mb-8">
                <div className="grid gap-8 lg:grid-cols-2">
                  <Chat
                    projectId={currentProject.id}
                    onCodeGenerated={(code) => {
                      setGeneratedCode(code);
                      // Update project
                      const savedProjects = localStorage.getItem(
                        `projects_${localStorage.getItem("user_email")}`,
                      );
                      if (savedProjects) {
                        const projects = JSON.parse(savedProjects);
                        const updatedProjects = projects.map((p: any) =>
                          p.id === currentProject.id
                            ? { ...p, code, updatedAt: new Date() }
                            : p,
                        );
                        localStorage.setItem(
                          `projects_${localStorage.getItem("user_email")}`,
                          JSON.stringify(updatedProjects),
                        );
                      }
                    }}
                  />
                  <Preview code={generatedCode} language={language} />
                </div>
              </div>
            )}
            {/* Input Section */}
            <Card className="lg:col-span-5 p-6 space-y-6 overflow-auto max-h-[calc(100vh-12rem)] sticky top-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Choose Language</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <Card
                      className={`p-4 cursor-pointer border-2 ${language === "web3" ? "border-primary" : "border-transparent"}`}
                      onClick={() => setLanguage("web3")}
                    >
                      <h3 className="font-semibold mb-2">Web3 Development ⛓</h3>
                      <p className="text-sm text-muted-foreground">
                        Build smart contracts and decentralized applications
                        using Solidity or NEAR.
                      </p>
                    </Card>
                    <Card
                      className={`p-4 cursor-pointer border-2 ${language === "ai" ? "border-primary" : "border-transparent"}`}
                      onClick={() => setLanguage("ai")}
                    >
                      <h3 className="font-semibold mb-2">AI Development 🤖</h3>
                      <p className="text-sm text-muted-foreground">
                        Create AI applications with LLMs, computer vision, and
                        machine learning.
                      </p>
                    </Card>
                    <Card
                      className={`p-4 cursor-pointer border-2 ${language === "fullstack" ? "border-primary" : "border-transparent"}`}
                      onClick={() => setLanguage("fullstack")}
                    >
                      <h3 className="font-semibold mb-2">Full Stack 🚀</h3>
                      <p className="text-sm text-muted-foreground">
                        Build complete web applications with React, Node.js, and
                        databases.
                      </p>
                    </Card>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Your Prompt</h2>
                  <p className="text-sm text-muted-foreground">
                    Describe what you want to build. Be as specific as possible.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-sm font-medium">Example prompts:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {language === "web3" ? (
                        <>
                          <li>
                            Create a token contract with minting and transfer
                            functions
                          </li>
                          <li>Build a decentralized marketplace for NFTs</li>
                          <li>Implement a cross-contract call example</li>
                        </>
                      ) : language === "ai" ? (
                        <>
                          <li>
                            Create a sentiment analysis model using transformers
                          </li>
                          <li>Build an image classification system with CNN</li>
                          <li>Implement a chatbot using GPT-4</li>
                        </>
                      ) : (
                        <>
                          <li>
                            Create a function that sorts an array using
                            quicksort
                          </li>
                          <li>
                            Build a simple HTTP server that handles GET requests
                          </li>
                          <li>
                            Implement a binary tree data structure with basic
                            operations
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <Textarea
                    placeholder={
                      language === "web3"
                        ? "Example: Create a smart contract for an NFT marketplace with minting and trading functions..."
                        : language === "ai"
                          ? "Example: Create a sentiment analysis model that can analyze customer reviews and classify them as positive, negative, or neutral..."
                          : "Example: Create a function that implements bubble sort with detailed comments explaining the algorithm..."
                    }
                    className="min-h-[150px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!prompt || isLoading || !hasApiKey}
                    title={
                      !hasApiKey ? "Please set your OpenAI API key first" : ""
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Code"
                    )}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Output Section */}
            <Card className="lg:col-span-7 p-6 overflow-auto max-h-[calc(100vh-12rem)] sticky top-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Generated Code</h2>
                <div className="bg-muted rounded-lg p-4 min-h-[300px] font-mono text-sm overflow-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">
                      {language === "ai" ? "PYTHON" : language.toUpperCase()}{" "}
                      Code
                    </span>
                    {generatedCode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedCode);
                          toast.success("Code copied to clipboard!");
                        }}
                      >
                        Copy Code
                      </Button>
                    )}
                  </div>
                  {generatedCode || (
                    <span className="text-muted-foreground">
                      Your generated code will appear here...
                    </span>
                  )}
                </div>
              </div>

              {language === "ai" && setupInstructions && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Setup Instructions
                  </h2>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm mt-6">
                    <pre className="whitespace-pre-wrap">
                      {setupInstructions}
                    </pre>
                  </div>
                </div>
              )}

              {language === "ai" && explanation && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Explanation</h2>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                    <pre className="whitespace-pre-wrap">{explanation}</pre>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      <Footer />
      {showTerminal && (
        <Terminal
          onClose={() => setShowTerminal(false)}
          projectId={projectId || undefined}
        />
      )}
    </div>
  );
}
