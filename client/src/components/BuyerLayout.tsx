import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Package,
  ShoppingCart,
  FileText,
  Heart,
  User,
  LogOut,
  Menu,
  FileCheck,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType } from "@shared/schema";
import { BrandLogo } from "@/components/BrandLogo";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const navigation = [
  { name: "Dashboard", href: "/buyer/dashboard", icon: Home },
  { name: "Catalog", href: "/buyer/catalog", icon: Package },
  { name: "Cart", href: "/buyer/cart", icon: ShoppingCart },
  { name: "Orders", href: "/buyer/orders", icon: FileText },
  { name: "Quotes", href: "/buyer/quotes", icon: FileCheck },
  { name: "Saved Lists", href: "/buyer/saved-lists", icon: Heart },
  { name: "Account", href: "/buyer/account", icon: User },
];

export function BuyerLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<Omit<UserType, "passwordHash">>({
    queryKey: ["/api/me"],
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
    <div className="flex h-full flex-col">
      <div className="p-6 border-b">
        <BrandLogo imageClassName="h-8" />
        {user && (
          <p className="text-sm text-muted-foreground mt-1">{user.name}</p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location === item.href || location.startsWith(item.href + "/");
          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-accent"
              )}
              data-testid={`nav-${item.name.toLowerCase().replace(" ", "-")}`}
            >
              <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start"
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
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:border-r">
        <SidebarContent />
      </div>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50"
            data-testid="button-mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
