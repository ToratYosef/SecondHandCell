import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ValuePropositions } from "@/components/value-propositions";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { DeviceShowcase } from "@/components/device-showcase";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ValuePropositions />
        <HowItWorksSection />
        <DeviceShowcase />
        <Testimonials />
        
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-primary/20">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Sell Your Device?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Get your instant quote in just 30 seconds
                </p>
                <Link href="/quote">
                  <Button size="lg" className="text-lg px-8" data-testid="button-final-cta">
                    Get Your Quote Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
