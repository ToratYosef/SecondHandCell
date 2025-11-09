import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">SecondHand(Whole)Cell</h3>
            <p className="text-sm text-muted-foreground">
              Premium refurbished smartphones with quality guarantee and wholesale pricing.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-muted-foreground hover:text-foreground">All Products</Link></li>
              <li><Link href="/products?brand=apple" className="text-muted-foreground hover:text-foreground">iPhone</Link></li>
              <li><Link href="/products?brand=samsung" className="text-muted-foreground hover:text-foreground">Samsung</Link></li>
              <li><Link href="/products?brand=google" className="text-muted-foreground hover:text-foreground">Google Pixel</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/warranty" className="text-muted-foreground hover:text-foreground">Warranty</Link></li>
              <li><Link href="/grading" className="text-muted-foreground hover:text-foreground">Grading Process</Link></li>
              <li><Link href="/shipping" className="text-muted-foreground hover:text-foreground">Shipping Info</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Wholesale</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/wholesale" className="text-muted-foreground hover:text-foreground">Apply Now</Link></li>
              <li><Link href="/bulk-pricing" className="text-muted-foreground hover:text-foreground">Bulk Pricing</Link></li>
              <li><Link href="/b2b" className="text-muted-foreground hover:text-foreground">B2B Solutions</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 SecondHand(Whole)Cell. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
