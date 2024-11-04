import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import { useState } from "react";

type ApiKeyInputProps = {
  onApiKeySubmit: (apiKey: string) => void;
  hasApiKey: boolean;
};

export function ApiKeyInput({ onApiKeySubmit, hasApiKey }: ApiKeyInputProps) {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = () => {
    onApiKeySubmit(apiKey);
    setOpen(false);
    setApiKey("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasApiKey ? "outline" : "default"}
          size="icon"
          className={!hasApiKey ? "animate-pulse" : ""}
        >
          <Key className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAI API Key</DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to use the code generation feature. Your
            key will be stored securely in your browser and never sent to our
            servers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Don't have an API key?{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Get one here
            </a>
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!apiKey}>
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
