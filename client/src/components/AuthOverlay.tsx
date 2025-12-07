import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, signInWithGoogle } from "@/lib/firebase";

interface AuthOverlayProps {
  title?: string;
  description?: string;
}

export function AuthOverlay({
  title = "Sign in required",
  description = "Use your Google account or email to continue.",
}: AuthOverlayProps) {
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const [isEmailLoading, setEmailLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailPassword = async () => {
    try {
      setError(null);
      setEmailLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err?.message || "Unable to sign in with email/password");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="max-w-md w-full shadow-2xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="overlay-email">Email</Label>
            <Input
              id="overlay-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="overlay-password">Password</Label>
            <Input
              id="overlay-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" size="lg" onClick={handleEmailPassword} disabled={isEmailLoading}>
            {isEmailLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Continue with email
          </Button>
          <Button className="w-full" size="lg" onClick={handleGoogle} disabled={isGoogleLoading}>
            {isGoogleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
