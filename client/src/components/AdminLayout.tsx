import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  Package,
  FileText,
  Users,
  Settings,
  LogOut,
  FileCheck,
  BarChart,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Companies", href: "/admin/companies", icon: Building2 },
    { name: "Reports", href: "/admin/reports", icon: BarChart },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: FileText },
  { name: "Quotes", href: "/admin/quotes", icon: FileCheck },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<{ id: string; name: string; email: string; role: string }>({
    queryKey: ["/api/me"],
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      queryClient.clear();
      setLocation("/login");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const SidebarContent = () => (
    <div className="flex items-center gap-4 overflow-x-auto py-2">
      {navigation.map((item) => {
        const isActive = location === item.href || location.startsWith(item.href + "/");
        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                isActive && "bg-accent"
              )}
              data-testid={`nav-${item.name.toLowerCase().replace(" ", "-")}`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-3 px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin Portal</p>
                <p className="text-lg font-semibold leading-tight">{user?.name || "Admin User"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="justify-start"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <SidebarContent />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-screen-xl px-4 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
