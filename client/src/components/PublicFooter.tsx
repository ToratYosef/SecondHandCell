import { Link } from "wouter";
import { BrandLogo } from "@/components/BrandLogo";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: "/buyer/catalog", label: "Catalog" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/support", label: "Support" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ];

  return (
    <footer className="border-t bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-start">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-4">
              <BrandLogo />
            </div>
            <p className="max-w-sm text-center text-sm text-muted-foreground md:text-left">
              Trusted wholesale device marketplace for verified buyers. Fast fulfillment and transparent pricing.
            </p>
          </div>

          {/* Useful Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="mb-3 text-sm font-semibold">Useful Links</h4>
            <nav className="flex flex-col space-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  data-testid={`link-footer-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact / Legal */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground">About Us</Link>
              <Link href="/support" className="hover:text-foreground">Contact Support</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © {currentYear} SecondHand(Whole)Cell. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
