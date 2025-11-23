import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BrandLogo } from "@/components/BrandLogo";

export function PublicHeader() {
  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/support", label: "Support" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 h-20 items-center gap-4">
          {/* Logo (left) */}
          <div className="col-start-1 flex items-center">
            <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
              <BrandLogo />
            </Link>
          </div>

          {/* Desktop Navigation (center) */}
          <div className="col-start-2 hidden md:flex md:items-center md:justify-center md:gap-6">
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
          </div>

          {/* Desktop Actions (right) */}
          <div className="col-start-3 hidden md:flex md:items-center md:justify-end md:gap-3">
            <Button variant="ghost" asChild data-testid="button-login">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild data-testid="button-apply">
              <Link href="/register">Apply Now</Link>
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
                  <Button variant="outline" asChild data-testid="button-mobile-login">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild data-testid="button-mobile-apply">
                    <Link href="/register">Apply Now</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>

      {/* Trust Indicator */}
      <div className="border-t bg-muted/50">
        <div className="container px-4 py-3 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            Trusted by 2,000+ wholesale buyers
          </p>
        </div>
      </div>
    </header>
  );
}
