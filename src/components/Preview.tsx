import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

type PreviewProps = {
  code: string;
  language: string;
};

export function Preview({ code, language }: PreviewProps) {
  const [key, setKey] = useState(0); // Used to force iframe refresh
  const [previewUrl, setPreviewUrl] = useState<string>();

  useEffect(() => {
    if (language.toLowerCase() === "html") {
      // Create a blob URL for HTML preview
      const blob = new Blob([code], { type: "text/html" });
      setPreviewUrl(URL.createObjectURL(blob));
      return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      };
    }
  }, [code, language]);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Preview</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          {previewUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(previewUrl, "_blank")}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Open in New Tab
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="preview" className="flex-1">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 mt-0">
          {language.toLowerCase() === "html" && previewUrl ? (
            <iframe
              key={key}
              src={previewUrl}
              className="w-full h-full"
              sandbox="allow-scripts"
              title="Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Preview not available for {language}
            </div>
          )}
        </TabsContent>

        <TabsContent value="code" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <pre className="p-4">
              <code>{code}</code>
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
