import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, LogIn, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAIL = "sales@secondhandcell.com";
const ADMIN_PASSWORD = "12345";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleAuthenticate = () => {
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Enter both the admin email and password.",
        variant: "destructive",
      });
      return;
    }

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      toast({
        title: "Access denied",
        description: "Use the operations email to unlock the dashboard.",
        variant: "destructive",
      });
      return;
    }

    if (password.trim() !== ADMIN_PASSWORD) {
      toast({
        title: "Access denied",
        description: "The password does not match our records.",
        variant: "destructive",
      });
      return;
    }

    setIsAuthenticated(true);
    toast({
      title: "Welcome back",
      description: "Administrative tools unlocked.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-primary/10">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          {!isAuthenticated ? (
            <div className="max-w-xl mx-auto">
              <Card className="border-primary/40 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Shield className="h-5 w-5" />
                    Admin verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-primary/10 border-primary/30">
                    <AlertTitle>Private workspace</AlertTitle>
                    <AlertDescription>
                      Use the credentials shared with the operations team. All actions inside the dashboard update customer workflows in real time and surface live support conversations.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Admin email</label>
                    <Input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={ADMIN_EMAIL}
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter password"
                      type="password"
                    />
                  </div>
                  <Button className="w-full" size="lg" onClick={handleAuthenticate}>
                    <LogIn className="h-4 w-4 mr-2" /> Unlock dashboard
                  </Button>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" /> This portal centralizes analytics, workflow automation, and now live support with typing previews.
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <AdminDashboard />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
