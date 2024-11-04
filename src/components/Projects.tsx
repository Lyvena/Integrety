import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { DeployDialog } from "./DeployDialog";

type Project = {
  id: string;
  name: string;
  language: string;
  code: string;
  prompt: string;
  preview?: string;
  chatHistory?: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

export function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Load projects from localStorage
    const loadProjects = () => {
      const savedProjects = localStorage.getItem(`projects_${user?.email}`);
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        setProjects(
          parsed.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
          })),
        );
      }
    };

    if (user) {
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [user]);

  const createProject = (name: string) => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      language: "",
      code: "",
      prompt: "",
      chatHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedProjects = [...projects, newProject];
    localStorage.setItem(
      `projects_${user?.email}`,
      JSON.stringify(updatedProjects),
    );
    setProjects(updatedProjects);
    return newProject;
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map((p) =>
      p.id === projectId ? { ...p, ...updates, updatedAt: new Date() } : p,
    );
    localStorage.setItem(
      `projects_${user?.email}`,
      JSON.stringify(updatedProjects),
    );
    setProjects(updatedProjects);
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    localStorage.setItem(
      `projects_${user?.email}`,
      JSON.stringify(updatedProjects),
    );
    setProjects(updatedProjects);
  };

  if (!user) return null;

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Your Projects</h2>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {projects.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No projects yet. Start by generating some code!
            </p>
          ) : (
            projects.map((project) => (
              <Card key={project.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.language} •{" "}
                      {project.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = `/Generate?project=${project.id}`;
                      }}
                    >
                      Continue
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProject(project.id)}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      Delete
                    </Button>
                    <DeployDialog
                      projectName={project.name}
                      code={project.code}
                    />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
