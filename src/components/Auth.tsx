import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import brain from "brain";
import { Github } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type User = {
  email: string;
  name: string;
  company?: string;
  token: string;
};

type FormData = {
  email: string;
  password: string;
  name?: string;
  company?: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await brain.login({ email, password });
      const userData = await response.json();
      localStorage.setItem("auth_token", userData.token);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to login");
    }
  };

  const loginWithGithub = async (code: string) => {
    try {
      const response = await brain.github_login({ code });
      const userData = await response.json();
      localStorage.setItem("auth_token", userData.token);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to login with GitHub");
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    company?: string,
  ) => {
    try {
      const response = await brain.register({ email, password, name, company });
      const userData = await response.json();
      localStorage.setItem("auth_token", userData.token);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to register");
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return { user, login, loginWithGithub, register, logout };
}

export function AuthDialog() {
  const [open, setOpen] = useState(false);
  const { user, login, loginWithGithub, register, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for GitHub OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      loginWithGithub(code)
        .then(() => {
          // Clear the URL parameters
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
          toast.success("Logged in with GitHub successfully!");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Could not log in with GitHub. Please try again.");
        });
    }
  }, [loginWithGithub]);

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const handleLogin = async (data: FormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      reset();
      setOpen(false);
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Could not log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: FormData) => {
    setIsLoading(true);
    try {
      await register(data.email, data.password, data.name!, data.company);
      reset();
      setOpen(false);
      toast.success("Account created successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Could not create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <Button
        variant="ghost"
        onClick={() => {
          logout();
          toast.success("Logged out successfully!");
        }}
      >
        Log Out
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Integrety</DialogTitle>
          <DialogDescription>
            Sign in or create an account to save your projects and use your own
            OpenAI API key.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerForm("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerForm("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const clientId = process.env.GITHUB_CLIENT_ID;
                    const redirectUri = window.location.origin;
                    const scope = "user:email";
                    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
                  }}
                  disabled={isLoading}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...registerForm("name", {
                    required: "Name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input id="company" {...registerForm("company")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerForm("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerForm("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
