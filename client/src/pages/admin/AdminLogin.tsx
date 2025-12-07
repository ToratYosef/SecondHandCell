import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";
import { Shield } from "lucide-react";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

async function ensureAdminRole(userId: string) {
  const profileRef = doc(collection(db, "users"), userId);
  const snapshot = await getDoc(profileRef);
  const role = snapshot.data()?.role;

  if (role !== "admin" && role !== "super_admin") {
    await signOut(auth);
    throw new Error("Admin access required. Sign in with an administrator account.");
  }
}

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { profile, isAdmin } = useFirebaseUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    document.title = "Admin sign in | SecondHand(Whole)Cell";
  }, []);

  useEffect(() => {
    if (profile && isAdmin) {
      setLocation("/admin/dashboard");
    } else if (profile && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Admin access only",
        description: "You are signed in as a buyer. Please use the buyer portal.",
      });
      setLocation("/buyer/dashboard");
    }
  }, [profile, isAdmin, setLocation, toast]);

  const loginMutation = useMutation({
    mutationFn: async (values: z.infer<typeof adminLoginSchema>) => {
      const credential = await signInWithEmailAndPassword(auth, values.email, values.password);
      await ensureAdminRole(credential.user.uid);
    },
    onSuccess: () => {
      toast({
        title: "Welcome back",
        description: "You are signed in as an admin.",
      });
      setLocation("/admin/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Sign-in failed",
        description: error?.message || "Unable to sign in as an admin.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <UnifiedHeader />

      <main className="flex flex-1 items-center justify-center py-16">
        <div className="mx-auto w-full max-w-xl px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl">
            <CardHeader className="space-y-2 border-b">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">Admin portal</span>
              </div>
              <CardTitle className="text-2xl">Secure admin sign in</CardTitle>
              <CardDescription>Use administrator credentials to access operations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <form onSubmit={handleSubmit((values) => loginMutation.mutate(values))} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="username"
                    placeholder="ops@company.com"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register("password")}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? "Checking access..." : "Sign in"}
                </Button>
              </form>

              <div className="rounded-lg bg-muted/60 p-4 text-sm text-muted-foreground">
                Need buyer access instead?{" "}
                <Link href="/login" className="font-semibold text-primary">
                  Sign in to the buyer portal
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
