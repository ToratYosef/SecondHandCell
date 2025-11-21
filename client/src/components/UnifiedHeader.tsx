import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/BrandLogo";

export function UnifiedHeader() {
  // Check auth status without throwing errors for unauthenticated users
  const { data: user } = useQuery<any>({ 
    queryKey: ["/api/me"],
    retry: false,
    throwOnError: false,
  });
  
  const isAuthenticated = !!user;
  
  // Only fetch cart if user is authenticated
  const { data: cart } = useQuery<any>({ 
    queryKey: ["/api/cart"],
    retry: false,
    throwOnError: false,
    enabled: isAuthenticated,
  });
  
  const cartItemCount = cart?.items?.length || 0;

  const navLinks = [
    ...(isAuthenticated ? [{ href: "/buyer/catalog", label: "Catalog" }] : []),
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/support", label: "Support" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-3 h-20 items-center px-4 sm:px-6 lg:px-8">
          {/* Logo (left) */}
          <div className="col-start-1 flex items-center">
            <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
              <BrandLogo />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="col-start-2 hidden md:flex md:items-center md:justify-center">
            <nav className="flex items-center gap-6">
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
          </div>

          {/* Desktop Actions (right) */}
          <div className="col-start-3 hidden md:flex md:items-center md:justify-end md:gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild data-testid="button-my-account">
                  <Link href="/buyer/dashboard">My Account</Link>
                </Button>
                <Button asChild data-testid="button-cart">
                  <Link href="/buyer/cart" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                    {cartItemCount > 0 && (
                      <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0.5 text-xs">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild data-testid="button-login">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild data-testid="button-apply">
                  <Link href="/register">Apply Now</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden">
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
                    {isAuthenticated ? (
                      <>
                        <Button variant="outline" asChild data-testid="button-mobile-my-account">
                          <Link href="/buyer/dashboard">My Account</Link>
                        </Button>
                        <Button asChild data-testid="button-mobile-cart">
                          <Link href="/buyer/cart" className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Cart
                            {cartItemCount > 0 && (
                              <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0.5 text-xs">
                                {cartItemCount}
                              </Badge>
                            )}
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" asChild data-testid="button-mobile-login">
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild data-testid="button-mobile-apply">
                          <Link href="/register">Apply Now</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Trust Indicator */}
      <div className="border-t bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-3 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            Trusted by 2,000+ wholesale buyers
          </p>
        </div>
      </div>
    </header>
  );
}
