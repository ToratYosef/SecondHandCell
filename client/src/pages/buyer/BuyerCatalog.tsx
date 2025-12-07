import { BuyerLayout } from "@/components/BuyerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Heart, Layers, Search, ShoppingCart } from "lucide-react";
import { PageShell } from "@/components/PageShell";

const filters = {
  conditions: ["A Grade", "B Grade", "C Grade"],
  carriers: ["Unlocked", "T-Mobile", "Verizon", "AT&T"],
  storage: ["64GB", "128GB", "256GB", "512GB"],
};

const catalog = [
  {
    title: "iPhone 14 Pro Mix",
    subtitle: "Unlocked • Face ID • Tested",
    badge: "Tiered pricing",
    price: "$410",
    tiers: "100+ units",
  },
  {
    title: "Samsung Galaxy S22 Lot",
    subtitle: "Carrier unlocked • Grade A/B",
    badge: "Hot stock",
    price: "$285",
    tiers: "50+ units",
  },
  {
    title: "Enterprise Laptop Batch",
    subtitle: "i7 • 16GB • 512GB SSD",
    badge: "Refreshed",
    price: "$520",
    tiers: "25+ units",
  },
  {
    title: "Wearables Bundle",
    subtitle: "Apple Watch + Galaxy Watch mix",
    badge: "Bulk ready",
    price: "$129",
    tiers: "200+ units",
  },
];

export default function BuyerCatalog() {
  return (
    <BuyerLayout>
      <PageShell
        title="Live catalog"
        description="Filter by condition, carrier, or storage to quickly lock in the inventory you need."
        badge="Inventory"
        actions={<Button asChild><a href="/buyer/quotes/new">Request quote</a></Button>}
      >
        <div className="grid gap-6 lg:grid-cols-4">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Layers className="h-4 w-4" />Filters</CardTitle>
              <CardDescription>Curate exactly what you need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search devices" className="w-full" />
                </div>
                <Button variant="secondary" className="w-full">Apply filters</Button>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Condition</p>
                {filters.conditions.map((condition) => (
                  <label key={condition} className="flex items-center gap-2 text-sm">
                    <Checkbox />
                    {condition}
                  </label>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Carrier</p>
                {filters.carriers.map((carrier) => (
                  <label key={carrier} className="flex items-center gap-2 text-sm">
                    <Checkbox />
                    {carrier}
                  </label>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Storage</p>
                {filters.storage.map((size) => (
                  <label key={size} className="flex items-center gap-2 text-sm">
                    <Checkbox />
                    {size}
                  </label>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Budget per unit</p>
                <Slider defaultValue={[420]} max={800} step={10} />
                <p className="text-xs text-muted-foreground">Show options at or below $420/unit</p>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-4">
            <Tabs defaultValue="featured" className="space-y-4">
              <TabsList>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="new">New arrivals</TabsTrigger>
                <TabsTrigger value="saved">Saved searches</TabsTrigger>
              </TabsList>
              <TabsContent value="featured" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {catalog.map((item) => (
                  <Card key={item.title} className="flex flex-col justify-between hover-elevate">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{item.badge}</Badge>
                        <Button variant="ghost" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Starting at</p>
                          <p className="text-2xl font-semibold">{item.price}</p>
                        </div>
                        <Badge>{item.tiers}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild className="flex-1">
                          <a href="/buyer/devices/sample">View lot</a>
                        </Button>
                        <Button variant="outline" size="icon">
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="new">
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle>Fresh inventory arriving daily</CardTitle>
                    <CardDescription>Save your filters to be notified the moment stock lands.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary">Save this search</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="saved">
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle>No saved searches yet</CardTitle>
                    <CardDescription>Create a search and we’ll alert you when it matches.</CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PageShell>
    </BuyerLayout>
  );
}
