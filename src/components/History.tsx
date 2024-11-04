import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { History as HistoryIcon } from "lucide-react";
import { useState } from "react";

type CodeEntry = {
  id: string;
  language: string;
  prompt: string;
  code: string;
  timestamp: string;
  setupInstructions?: string;
  explanation?: string;
};

type HistoryProps = {
  onSelect: (entry: CodeEntry) => void;
};

export function History({ onSelect }: HistoryProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<CodeEntry[]>(() => {
    const saved = localStorage.getItem("codeHistory");
    return saved ? JSON.parse(saved) : [];
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <HistoryIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Generation History</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {history.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No history yet. Generate some code to get started!
            </p>
          ) : (
            history.map((entry) => (
              <Card
                key={entry.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  onSelect(entry);
                  setOpen(false);
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">
                    {entry.language.toUpperCase()}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {entry.prompt}
                </p>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function saveToHistory(entry: Omit<CodeEntry, "id" | "timestamp">) {
  const history = JSON.parse(localStorage.getItem("codeHistory") || "[]");
  const newEntry = {
    ...entry,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
  };
  const updatedHistory = [newEntry, ...history].slice(0, 50); // Keep last 50 entries
  localStorage.setItem("codeHistory", JSON.stringify(updatedHistory));
  return newEntry;
}
