import { Link } from "wouter";
import { Smartphone, Mail, Phone, Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">SecondhandCell</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Get the best prices for your iPhone and Samsung devices. Fast, secure, and trusted.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" data-testid="button-social-facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="button-social-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="button-social-instagram">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" data-testid="link-footer-home">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/quote" data-testid="link-footer-quote">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer">Get Quote</span>
                </Link>
              </li>
              <li>
                <Link href="/devices" data-testid="link-footer-devices">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer">Devices We Buy</span>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" data-testid="link-footer-how-it-works">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer">How It Works</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@secondhandcell.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>1-800-CELL-BUY</span>
              </li>
              <li>
                <span className="block">Business Hours:</span>
                <span className="block">Mon-Fri: 9AM - 6PM EST</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest device buyback prices
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                data-testid="input-newsletter-email"
              />
              <Button data-testid="button-newsletter-submit">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 SecondhandCell. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
