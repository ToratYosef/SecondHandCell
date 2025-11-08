import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, DollarSign } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_smartphones_collection_image_d95e8608.png";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Get Cash for Your iPhone or Samsung Today
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
          Instant quotes. Fast payment. Trusted by thousands.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/quote">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              data-testid="button-hero-get-quote"
            >
              Get Your Quote Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 bg-background/20 backdrop-blur-sm border-white/30 text-white hover:bg-background/30"
              data-testid="button-hero-learn-more"
            >
              Learn How It Works
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-8 justify-center items-center text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>Secure & Trusted</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <span>Instant Quotes</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <span>Best Prices Guaranteed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
