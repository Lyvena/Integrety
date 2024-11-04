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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = getFirestore();

type FormData = {
  email: string;
  password: string;
  name?: string;
  company?: string;
};

export function useLoggedInUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) {
      console.error(
        "Firebase Auth service is not initialized.\nCheck out https://docs.databutton.com/databutton-tips-and-tricks/adding-authentication",
      );
      return;
    }

    const unsubscribe = auth?.onAuthStateChanged((user: User | null) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return user;
}

export async function signOutUser() {
  if (auth) {
    await signOut(auth);
  } else {
    console.error("Sign out failed: Firebase Auth service is not initialized.");
  }
}

export function AuthDialog() {
  const [open, setOpen] = useState(false);
  const user = useLoggedInUser();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const handleSignIn = async (data: FormData) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth!, data.email, data.password);
      reset();
      setOpen(false);
      toast.success("Signed in successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Could not sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: FormData) => {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth!, data.email, data.password);
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth!, provider);
      setOpen(false);
      toast.success("Signed in with Google successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Could not sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <Button
        variant="ghost"
        onClick={() => {
          signOutUser();
          toast.success("Signed out successfully!");
        }}
      >
        Sign Out
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
            <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
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
                  {...register("password", {
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

              <DialogFooter className="flex-col gap-2 sm:flex-col">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  Sign In
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  Sign in with Google
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register("name", {
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
                <Input id="company" {...register("company")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
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
                  {...register("password", {
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

              <DialogFooter className="flex-col gap-2 sm:flex-col">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  Create Account
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  Sign up with Google
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
