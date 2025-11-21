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
    <footer className="border-t bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <BrandLogo />

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {currentYear} SecondHand(Whole)Cell. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
