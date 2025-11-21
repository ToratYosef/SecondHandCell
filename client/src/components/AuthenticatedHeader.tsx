import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/BrandLogo";

interface CartResponse {
  items: Array<{
    id: string;
    quantity: number;
  }>;
}

export function AuthenticatedHeader() {
  const navLinks = [
    { href: "/buyer/catalog", label: "Catalog" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/support", label: "Support" },
  ];

  const { data: cart } = useQuery<CartResponse>({
    queryKey: ["/api/cart"],
  });

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/buyer/catalog" className="flex items-center space-x-2" data-testid="link-home">
          <BrandLogo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              data-testid={`link-${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <Button variant="ghost" asChild data-testid="button-account">
            <Link href="/buyer/account">
              <User className="mr-2 h-4 w-4" />
              My Account
            </Link>
          </Button>
          <Button asChild data-testid="button-cart">
            <Link href="/buyer/cart">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
              {cartItemCount > 0 && (
                <Badge variant="secondary" className="ml-2 no-default-hover-elevate no-default-active-elevate">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium"
                    data-testid={`link-mobile-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2">
                  <Button variant="outline" asChild data-testid="button-mobile-account">
                    <Link href="/buyer/account">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  </Button>
                  <Button asChild data-testid="button-mobile-cart">
                    <Link href="/buyer/cart">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Cart {cartItemCount > 0 && `(${cartItemCount})`}
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Trust Indicator */}
      <div className="border-t bg-muted/50">
        <div className="container px-4 py-2 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            Trusted by 2,000+ wholesale buyers
          </p>
        </div>
      </div>
    </header>
  );
}
