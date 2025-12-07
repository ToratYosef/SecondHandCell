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
import { useCatalog } from "@/hooks/useCatalog";

const filters = {
  conditions: ["A Grade", "B Grade", "C Grade"],
  carriers: ["Unlocked", "T-Mobile", "Verizon", "AT&T"],
  storage: ["64GB", "128GB", "256GB", "512GB"],
};

export default function BuyerCatalog() {
  const { items, loading } = useCatalog();

  const formatPrice = (price?: number) => {
    if (!price || Number.isNaN(price)) return "Contact for pricing";
    return price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  };

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
              {loading ? (
                <Card className="sm:col-span-2 xl:col-span-3 border-dashed">
                  <CardHeader>
                    <CardTitle>Loading catalog…</CardTitle>
                    <CardDescription>Fetching the latest inventory.</CardDescription>
                  </CardHeader>
                </Card>
              ) : items.length === 0 ? (
                <Card className="sm:col-span-2 xl:col-span-3 border-dashed">
                  <CardHeader>
                    <CardTitle>No inventory yet</CardTitle>
                    <CardDescription>Catalog items will appear here as soon as they are added.</CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                items.map((item) => (
                  <Card key={item.id} className="flex flex-col justify-between hover-elevate">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{item.status || "Available"}</Badge>
                        <Button variant="ghost" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle>{item.brand ? `${item.brand} ${item.model}` : item.model}</CardTitle>
                      <CardDescription>
                        {[item.storage, item.condition].filter(Boolean).join(" • ") || "Live catalog item"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Starting at</p>
                          <p className="text-2xl font-semibold">{formatPrice(item.price)}</p>
                        </div>
                        {item.updatedAt ? (
                          <Badge variant="outline">Updated {new Date(item.updatedAt).toLocaleDateString()}</Badge>
                        ) : null}
                      </div>
                      <div className="flex gap-2">
                        <Button asChild className="flex-1">
                          <a href={`/buyer/devices/${item.id}`}>View lot</a>
                        </Button>
                        <Button variant="outline" size="icon">
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
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
