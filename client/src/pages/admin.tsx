import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ACCESS_CODE = "secondhand-secure";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleAuthenticate = () => {
    if (!email || !passcode) {
      toast({
        title: "Missing information",
        description: "Enter both an admin email and access code.",
        variant: "destructive",
      });
      return;
    }

    if (passcode.trim() !== ACCESS_CODE) {
      toast({
        title: "Access denied",
        description: "The access code does not match.",
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-secondary/10">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          {!isAuthenticated ? (
            <div className="max-w-xl mx-auto">
              <Card className="border-primary/40">
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
                      Use the internal access code shared with the operations team. All actions inside the dashboard update customer workflows in real time.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Admin email</label>
                    <Input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@secondhandcell.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Access code</label>
                    <Input
                      value={passcode}
                      onChange={(event) => setPasscode(event.target.value)}
                      placeholder="Enter access code"
                      type="password"
                    />
                  </div>
                  <Button className="w-full" size="lg" onClick={handleAuthenticate}>
                    <LogIn className="h-4 w-4 mr-2" /> Unlock dashboard
                  </Button>
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
