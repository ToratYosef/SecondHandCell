import { useQuery } from "@tanstack/react-query";
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
  Menu,
  FileCheck,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Companies", href: "/admin/companies", icon: Building2 },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: FileText },
  { name: "Quotes", href: "/admin/quotes", icon: FileCheck },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const { data: user } = useQuery<{ id: string; name: string; email: string; role: string }>({
    queryKey: ["/api/me"],
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
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
    <div className="flex h-full flex-col items-center text-center">
      <div className="w-full border-b p-6">
        <h2 className="text-xl font-semibold">Admin Portal</h2>
        {user && (
          <p className="mt-1 text-sm text-muted-foreground">{user.name}</p>
        )}
      </div>

      <nav className="flex-1 w-full space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = location === item.href || location.startsWith(item.href + "/");
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-center",
                  isActive && "bg-accent"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(" ", "-")}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="w-full border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-center"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full flex-col items-center text-center md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:border-r md:text-center">
        <SidebarContent />
      </div>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-1/2 top-4 z-50 -translate-x-1/2"
            data-testid="button-mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 text-center">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center overflow-hidden">
        <main className="flex-1 w-full overflow-y-auto p-6 text-center md:p-8">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
