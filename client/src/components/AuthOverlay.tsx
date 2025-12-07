import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signInAsGuest, signInWithGoogle } from "@/lib/firebase";
import { Loader2, ShieldAlert } from "lucide-react";
import { useState } from "react";

interface AuthOverlayProps {
  title?: string;
  description?: string;
}

export function AuthOverlay({
  title = "Sign in required",
  description = "Use your Google account or continue as a guest to see this section.",
}: AuthOverlayProps) {
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const [isGuestLoading, setGuestLoading] = useState(false);

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuest = async () => {
    try {
      setGuestLoading(true);
      await signInAsGuest();
    } finally {
      setGuestLoading(false);
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
          <Button className="w-full" size="lg" onClick={handleGoogle} disabled={isGoogleLoading}>
            {isGoogleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign in with Google
          </Button>
          <Button variant="outline" className="w-full" onClick={handleGuest} disabled={isGuestLoading}>
            {isGuestLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Continue as guest
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Guests can browse but need approval for admin permissions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
