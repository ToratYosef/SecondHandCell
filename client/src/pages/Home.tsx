import { Button } from "@/components/ui/button";
import GlassCard from "@/components/GlassCard";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Shield, Award, Package } from "lucide-react";
import { Link } from "wouter";
import heroImage from '@assets/generated_images/Premium_phones_hero_image_be1fafc8.png';
import qualityImage from '@assets/generated_images/Quality_testing_warehouse_38d87ab2.png';
import iphoneBlue from '@assets/generated_images/iPhone_13_Pro_Blue_b5275bdb.png';
import iphoneBlack from '@assets/generated_images/iPhone_13_Pro_Black_0adbf2a8.png';
import galaxyS21 from '@assets/generated_images/Samsung_Galaxy_S21_Ultra_b0ff5079.png';
import pixel7 from '@assets/generated_images/Google_Pixel_7_Pro_7213306e.png';

export default function Home() {
  // todo: remove mock functionality
  const featuredProducts = [
    {
      id: 'iphone-13-pro-blue',
      title: 'iPhone 13 Pro 128GB - Blue',
      brand: 'Apple',
      image: iphoneBlue,
      grade: 'A',
      price: 64900,
      originalPrice: 79900,
      stock: 12,
    },
    {
      id: 'iphone-13-pro-black',
      title: 'iPhone 13 Pro 256GB - Black',
      brand: 'Apple',
      image: iphoneBlack,
      grade: 'A',
      price: 74900,
      originalPrice: 89900,
      stock: 8,
    },
    {
      id: 'galaxy-s21-ultra',
      title: 'Samsung Galaxy S21 Ultra 256GB',
      brand: 'Samsung',
      image: galaxyS21,
      grade: 'B',
      price: 59900,
      originalPrice: 74900,
      stock: 15,
    },
    {
      id: 'pixel-7-pro',
      title: 'Google Pixel 7 Pro 128GB',
      brand: 'Google',
      image: pixel7,
      grade: 'A',
      price: 54900,
      originalPrice: 69900,
      stock: 20,
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 md:px-8 text-center">
          <GlassCard className="max-w-3xl mx-auto">
            <div className="p-12">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Premium Refurbished Phones
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Quality tested smartphones with warranty. Retail and wholesale pricing available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg" variant="default" className="bg-primary/90 backdrop-blur-lg" data-testid="button-browse-phones">
                    Browse Phones
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/wholesale">
                  <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-lg border-white/30 text-white hover:bg-white/20" data-testid="button-wholesale">
                    Wholesale Inquiry
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard variant="secondary">
              <div className="p-8 text-center">
                <Shield className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">90-Day Warranty</h3>
                <p className="text-white/80">Full warranty coverage on all devices</p>
              </div>
            </GlassCard>
            <GlassCard variant="secondary">
              <div className="p-8 text-center">
                <Award className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Quality Graded</h3>
                <p className="text-white/80">Professional testing and grading process</p>
              </div>
            </GlassCard>
            <GlassCard variant="secondary">
              <div className="p-8 text-center">
                <Package className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Bulk Pricing</h3>
                <p className="text-white/80">Save more with wholesale orders</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Deals</h2>
            <p className="text-muted-foreground text-lg">Top quality refurbished phones at unbeatable prices</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <div key={product.id} className="bg-gradient-to-br from-blue-600 to-purple-600 p-1 rounded-2xl">
                <ProductCard
                  {...product}
                  onClick={() => console.log('Navigate to product:', product.id)}
                />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" data-testid="button-view-all">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Quality You Can Trust</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Every device undergoes rigorous testing and certification. Our professional grading system ensures you know exactly what you're getting.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Comprehensive Testing</h4>
                    <p className="text-muted-foreground">60-point inspection on every device</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Certified Grading</h4>
                    <p className="text-muted-foreground">Transparent condition ratings from A to C</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Package className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Secure Packaging</h4>
                    <p className="text-muted-foreground">Safe delivery with tracking</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img 
                src={qualityImage} 
                alt="Quality testing warehouse" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <GlassCard className="max-w-4xl mx-auto">
            <div className="p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Ready for Wholesale?</h2>
              <p className="text-xl text-white/90 mb-8">
                Get access to bulk pricing and dedicated support for your business
              </p>
              <Link href="/wholesale">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-lg border-white/30 text-white hover:bg-white/20" data-testid="button-apply-wholesale">
                  Apply for Wholesale Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
