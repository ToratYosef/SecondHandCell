import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import Logo from "@/assets/logo.svg";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 hover-elevate active-elevate-2 px-3 py-2 rounded-md cursor-pointer">
              <img src={Logo} alt="SecondHandCell logo" className="h-9 w-9" />
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-extrabold text-primary">Second</span>
                <span className="text-xl font-extrabold text-secondary -mt-2">HandCell</span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/" data-testid="link-nav-home">
              <Button variant={location === "/" ? "secondary" : "ghost"}>
                Home
              </Button>
            </Link>
            <Link href="/quote" data-testid="link-nav-quote">
              <Button variant={location === "/quote" ? "secondary" : "ghost"}>
                Get Quote
              </Button>
            </Link>
            <Link href="/devices" data-testid="link-nav-devices">
              <Button variant={location === "/devices" ? "secondary" : "ghost"}>
                Devices
              </Button>
            </Link>
            <Link href="/how-it-works" data-testid="link-nav-how-it-works">
              <Button variant={location === "/how-it-works" ? "secondary" : "ghost"}>
                How It Works
              </Button>
            </Link>
            <Link href="/contact" data-testid="link-nav-contact">
              <Button variant={location === "/contact" ? "secondary" : "ghost"}>
                Contact
              </Button>
            </Link>
            <Link href="/admin" data-testid="link-nav-admin">
              <Button variant={location === "/admin" ? "secondary" : "ghost"}>
                Admin
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/quote">
              <Button data-testid="button-get-quote-nav">Get Quote</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
