import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { CheckCircle2, TrendingUp, Truck, Users, Smartphone, Tablet, Laptop, Watch } from "lucide-react";
import warehouseHero from "@assets/generated_images/Warehouse_hero_background_image_8f8c1570.png";
import smartphonesImg from "@assets/generated_images/Smartphones_category_showcase_e50f627a.png";
import tabletsImg from "@assets/generated_images/Tablets_category_showcase_f9fdb22c.png";
import laptopsImg from "@assets/generated_images/Laptops_category_showcase_198d90c9.png";
import smartwatchesImg from "@assets/generated_images/Smartwatches_category_showcase_a9319cde.png";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
    throwOnError: false,
  });

  const isAuthenticated = Boolean(user);

  const categories = [
    { name: "Smartphones", slug: "smartphones", icon: Smartphone, image: smartphonesImg },
    { name: "Tablets", slug: "tablets", icon: Tablet, image: tabletsImg },
    { name: "Laptops", slug: "laptops", icon: Laptop, image: laptopsImg },
    { name: "Wearables", slug: "wearables", icon: Watch, image: smartwatchesImg },
  ];

  const steps = [
    {
      title: "Sign up and get approved",
      description: "Create your company account and upload reseller documentation. Our team reviews applications within one business day.",
      icon: Users,
    },
    {
      title: "Browse live wholesale inventory",
      description: "Access real-time stock levels and transparent tiered pricing across thousands of verified devices.",
      icon: TrendingUp,
    },
    {
      title: "Place bulk orders",
      description: "Pay by card, wire, ACH, or use net terms for approved accounts. Secure checkout in minutes.",
      icon: CheckCircle2,
    },
    {
      title: "Track shipments and grow margins",
      description: "Monitor deliveries in real-time, access saved lists for easy reordering, and scale your business.",
      icon: Truck,
    },
  ];

  const benefits = [
    {
      title: "Real, test-verified devices",
      description: "Every device is inspected, tested, and graded by certified technicians using industry-standard protocols.",
    },
    {
      title: "Transparent tiered pricing",
      description: "See exactly what you'll pay based on quantity. No hidden fees, no surprises—just clear wholesale pricing.",
    },
    {
      title: "Fast fulfillment from US warehouses",
      description: "Orders ship within 24-48 hours from strategically located facilities across the country.",
    },
    {
      title: "Dedicated account support",
      description: "Your success is our priority. Get personalized assistance from wholesale specialists who understand your business.",
    },
  ];

  const testimonials = [
    {
      company: "TechResale Pro",
      quote: "SecondHand(Whole)Cell transformed our sourcing process. The tiered pricing and reliable grading gave us the confidence to scale from 100 to 500+ units per month.",
      author: "Sarah M., Operations Director",
    },
    {
      company: "Mobile Refresh Co",
      quote: "Finally, a wholesale partner that delivers on quality and speed. The transparency in inventory and pricing means we can plan our business accurately.",
      author: "James T., Founder",
    },
    {
      company: "DeviceHub Wholesale",
      quote: "We've tried multiple suppliers over the years. The test verification process and customer support here are unmatched in the industry.",
      author: "Maria L., Purchasing Manager",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${warehouseHero})` }}
        >
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white lg:text-6xl" data-testid="text-hero-headline">
              Wholesale Devices, Done Right.
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-white/90" data-testid="text-hero-subheading">
              SecondHand(Whole)Cell connects serious buyers with reliably graded, competitively priced used devices, ready to ship in bulk.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover-elevate active-elevate-2" data-testid="button-browse-catalog">
                <Link href={isAuthenticated ? "/buyer/catalog" : "/login"}>
                  {isAuthenticated ? "See Catalog" : "Sign In"}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover-elevate active-elevate-2" data-testid="button-apply-account">
                <Link href={isAuthenticated ? "/buyer/dashboard" : "/register"}>
                  {isAuthenticated ? "Go to Dashboard" : "Apply for Wholesale Account"}
                </Link>
              </Button>
            </div>
            
            {/* Scroll Indicator */}
            <div className="mt-16 animate-bounce">
              <div className="mx-auto h-10 w-6 rounded-full border-2 border-white/30">
                <div className="mt-2 h-2 w-2 mx-auto rounded-full bg-white/50" />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-b bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-semibold lg:text-4xl" data-testid="text-how-it-works">
                How It Works
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
                Getting started with wholesale purchasing is simple and straightforward
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="hover-elevate" data-testid={`card-step-${index}`}>
                  <CardHeader>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="bg-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-semibold lg:text-4xl" data-testid="text-key-benefits">
                Why Wholesale Buyers Choose Us
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4" data-testid={`benefit-${index}`}>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">{benefit.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="border-b py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-semibold lg:text-4xl" data-testid="text-featured-categories">
                Shop by Category
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {categories.map((category) => (
                <Link key={category.slug} href={`/catalog?category=${category.slug}`}>
                  <Card className="group overflow-hidden hover-elevate active-elevate-2" data-testid={`card-category-${category.slug}`}>
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center gap-2">
                        <category.icon className="h-5 w-5 text-primary" />
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-semibold lg:text-4xl" data-testid="text-testimonials">
                Trusted by Industry Leaders
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} data-testid={`card-testimonial-${index}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">{testimonial.company}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">"{testimonial.quote}"</p>
                    <p className="text-xs font-medium text-foreground">— {testimonial.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="border-t bg-primary py-16 text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-semibold lg:text-4xl" data-testid="text-cta-banner">
              Ready to see pricing?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/90">
              Create a free wholesale account in minutes.
            </p>
            <Button size="lg" variant="secondary" asChild className="hover-elevate active-elevate-2" data-testid="button-create-account">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
