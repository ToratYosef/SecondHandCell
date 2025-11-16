import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Lock, Smartphone } from "lucide-react";

export default function Catalog() {
  // Mock data - will be replaced with real data from backend
  const mockDevices = [
    {
      id: "1",
      brand: "Apple",
      name: "iPhone 13 Pro",
      slug: "iphone-13-pro",
      category: "Smartphones",
      imageUrl: "/placeholder-phone.png",
      variants: [
        { storage: "128GB", condition: "A", lockStatus: "unlocked", availability: "In Stock" },
        { storage: "256GB", condition: "B", lockStatus: "unlocked", availability: "In Stock" },
      ],
    },
    {
      id: "2",
      brand: "Samsung",
      name: "Galaxy S21",
      slug: "galaxy-s21",
      category: "Smartphones",
      imageUrl: "/placeholder-phone.png",
      variants: [
        { storage: "128GB", condition: "A", lockStatus: "unlocked", availability: "In Stock" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      
      <main className="flex-1">
        {/* Header */}
        <section className="border-b bg-muted/30 py-12">
          <div className="container px-4 sm:px-6 lg:px-8">
            <h1 className="mb-4 text-4xl font-bold tracking-tight" data-testid="text-catalog-headline">
              Wholesale Device Catalog
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Browse our inventory of certified pre-owned devices. Sign in to see wholesale pricing.
            </p>
          </div>
        </section>

        {/* Catalog Content */}
        <section className="py-12">
          <div className="container px-4 sm:px-6 lg:px-8">
            {/* Filters Placeholder */}
            <div className="mb-8 flex flex-wrap gap-4">
              <p className="text-sm text-muted-foreground">
                Filter by: Category • Brand • Storage • Condition
              </p>
            </div>

            {/* Login Notice */}
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardContent className="flex items-center justify-between gap-4 p-6">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-primary" />
                  <p className="text-sm">
                    <strong>Sign in to view wholesale pricing</strong> — Approved wholesale buyers get access to tiered pricing and bulk ordering
                  </p>
                </div>
                <Button asChild data-testid="button-catalog-login">
                  <Link href="/login">Login</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Device Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockDevices.map((device) => (
                <Card key={device.id} className="hover-elevate" data-testid={`card-device-${device.id}`}>
                  <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                    <Smartphone className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="secondary">{device.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">
                      {device.brand} {device.name}
                    </CardTitle>
                    <CardDescription>
                      {device.variants.length} variant{device.variants.length !== 1 ? 's' : ''} available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {device.variants.slice(0, 2).map((variant, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span>{variant.storage} • Grade {variant.condition} • {variant.lockStatus}</span>
                          <Badge variant="outline" className="text-xs">{variant.availability}</Badge>
                        </div>
                      ))}
                      {device.variants.length > 2 && (
                        <p className="text-xs">+ {device.variants.length - 2} more</p>
                      )}
                    </div>
                    <Button variant="outline" className="mt-4 w-full" asChild data-testid={`button-view-${device.id}`}>
                      <Link href={`/catalog/${device.slug}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State Message */}
            {mockDevices.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-lg text-muted-foreground">No devices found matching your filters.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
