import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCatalog } from "@/hooks/useCatalog";
import { AuthOverlay } from "@/components/AuthOverlay";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Plus } from "lucide-react";

export default function AdminDashboard() {
  const { items, summary, loading } = useCatalog();
  const { isAdmin, profile } = useFirebaseUser();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ model: "", brand: "", storage: "", condition: "", price: "" });
  const [isSaving, setSaving] = useState(false);

  const latestItems = useMemo(() => items.slice(0, 5), [items]);

  const handleCreate = async () => {
    setSaving(true);
    const ref = doc(collection(db, "catalog"));
    await setDoc(ref, {
      ...newItem,
      price: Number(newItem.price) || 0,
      status: "live",
      updatedAt: serverTimestamp(),
      createdBy: profile?.email ?? "",
    });
    setSaving(false);
    setDialogOpen(false);
    setNewItem({ model: "", brand: "", storage: "", condition: "", price: "" });
  };

  return (
    <PageShell
      title="Catalog workspace"
      description="Track live catalog activity and publish updates from one view."
      badge="Admin"
      actions={
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add catalog item
        </Button>
      }
    >
      {!isAdmin && <AuthOverlay title="Admin access required" description="Sign in to manage the catalog." />}

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard title="Live items" value={loading ? "–" : summary.total.toString()} hint="Active listings" />
        <StatCard title="Brands" value={loading ? "–" : summary.brands.toString()} hint="Unique brands" />
        <StatCard title="Avg. price" value={loading ? "–" : `$${summary.avgPrice.toFixed(2)}`} hint="Per item" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Latest updates</CardTitle>
              <CardDescription>Recent catalog changes pushed to buyers</CardDescription>
            </div>
            <Badge variant="outline">Realtime</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading catalog
              </div>
            ) : latestItems.length === 0 ? (
              <EmptyState />
            ) : (
              latestItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-semibold">{item.model}</p>
                    <p className="text-sm text-muted-foreground">
                      {[item.brand, item.storage, item.condition].filter(Boolean).join(" • ") || "Unspecified"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.price ? `$${item.price.toFixed(2)}` : "Price TBC"}</p>
                    <Badge variant={item.status === "live" ? "secondary" : "outline"}>{item.status || "draft"}</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Who last touched the catalog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex items-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing activity
              </div>
            ) : latestItems.length === 0 ? (
              <EmptyState />
            ) : (
              latestItems.map((item) => (
                <div key={item.id} className="rounded-lg bg-muted/60 p-3">
                  <p className="text-sm font-semibold">{item.model}</p>
                  <p className="text-xs text-muted-foreground">Updated {item.updatedAt ? new Date(item.updatedAt as any).toLocaleString() : "just now"}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="catalog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="rules">Quality rules</TabsTrigger>
        </TabsList>
        <TabsContent value="catalog">
          <Card>
            <CardHeader>
              <CardTitle>All catalog items</CardTitle>
              <CardDescription>Live view of what buyers can see</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading catalog
                </div>
              ) : items.length === 0 ? (
                <EmptyState />
              ) : (
                items.map((item) => (
                  <Card key={item.id} className="border-dashed">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{item.model}</CardTitle>
                      <CardDescription>
                        {[item.brand, item.storage, item.condition].filter(Boolean).join(" • ") || "Unspecified"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between text-sm">
                      <Badge variant="secondary">{item.status || "draft"}</Badge>
                      <span className="font-semibold">{item.price ? `$${item.price.toFixed(2)}` : "TBD"}</span>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Operational guardrails</CardTitle>
              <CardDescription>Make sure only clean data ships to buyers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• All new items require brand, model, and grade before publishing.</p>
              <p>• Pricing must be updated weekly; alerts trigger after 7 days of inactivity.</p>
              <p>• Anonymous users can preview catalog but cannot publish changes.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add catalog item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Field label="Model" value={newItem.model} onChange={(value) => setNewItem({ ...newItem, model: value })} />
            <Field label="Brand" value={newItem.brand} onChange={(value) => setNewItem({ ...newItem, brand: value })} />
            <Field label="Storage" value={newItem.storage} onChange={(value) => setNewItem({ ...newItem, storage: value })} />
            <Field label="Condition" value={newItem.condition} onChange={(value) => setNewItem({ ...newItem, condition: value })} />
            <Field label="Price" type="number" value={newItem.price} onChange={(value) => setNewItem({ ...newItem, price: value })} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSaving || !isAdmin}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

function StatCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <Card className="hover-elevate">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-muted-foreground">{hint}</CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center rounded-lg border border-dashed p-6 text-muted-foreground">
      No catalog data yet. Add your first item to get started.
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input value={value} type={type} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
