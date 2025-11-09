import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ValuePropositions } from "@/components/value-propositions";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { DeviceShowcase } from "@/components/device-showcase";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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

        <section className="py-12 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-2">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle>Shipping options built for speed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Choose a free email label or upgrade to our $10 shipping kit. Kits include:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Outbound label straight to your door</li>
                  <li>Inbound label returning the device to us</li>
                  <li>Printable 4x2 order card with GB, condition, and lock status</li>
                </ul>
                <Alert className="bg-secondary/10 border-secondary/40">
                  <AlertTitle>Automated follow-ups</AlertTitle>
                  <AlertDescription>
                    A reminder email is triggered 7 days after your kit arrives. If the device still hasn’t shipped after 15 days we’ll cancel the order and retire the labels.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-secondary/40">
              <CardHeader>
                <CardTitle>Carrier &amp; device eligibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>We proudly support:</p>
                <div className="flex flex-wrap gap-2">
                  {(["AT&T", "VZW", "TMO", "UNLOCKED"] as const).map((carrier) => (
                    <Badge key={carrier} className="bg-primary/10 text-primary text-sm px-3 py-1">
                      {carrier}
                    </Badge>
                  ))}
                </div>
                <p className="text-primary font-semibold">We do not accept blacklisted or finance-locked devices.</p>
                <p>Photos and updated pricing tables can be uploaded by our admins directly within the secure dashboard.</p>
              </CardContent>
            </Card>
          </div>
        </section>

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
