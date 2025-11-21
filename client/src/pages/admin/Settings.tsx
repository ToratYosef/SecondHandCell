import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { notifyLogoChange } from "@/hooks/useCompanyBranding";

export default function Settings() {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });
  const [logoUrl, setLogoUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("companyLogo") || "";
    }
    return "";
  });
  const handleToggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    toast({
      title: "Theme updated",
      description: `Switched to ${checked ? "dark" : "light"} mode`,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = () => {
    if (logoUrl) {
      localStorage.setItem("companyLogo", logoUrl);
      notifyLogoChange();
      toast({
        title: "Logo saved",
        description: "Company logo has been updated successfully",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your application settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch
                  checked={darkMode}
                  onCheckedChange={handleToggleDarkMode}
                  data-testid="switch-dark-mode"
                />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Upload and manage your company logo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-url">Logo URL</Label>
              <Input
                id="logo-url"
                type="url"
                placeholder="https://your-cdn.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                data-testid="input-logo-url"
              />
              <p className="text-xs text-muted-foreground">
                Paste a direct image URL or upload a file below to update the sitewide logo.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo-upload">Company Logo</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="cursor-pointer"
                    data-testid="input-logo"
                  />
                </div>
                <Button
                  onClick={handleSaveLogo}
                  disabled={!logoUrl}
                  data-testid="button-save-logo"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
              {logoUrl && (
                <div className="mt-4 p-4 border rounded-md bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <img
                    src={logoUrl}
                    alt="Company logo preview"
                    className="max-h-24 object-contain"
                    data-testid="img-logo-preview"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Application details and version information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Application Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Environment</span>
                <span className="font-medium">Production</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Database Status</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates for important events
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-email-notifications" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Order Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new orders
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-order-notifications" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Quote Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for new quote requests
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-quote-notifications" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
