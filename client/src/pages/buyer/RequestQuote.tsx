// @ts-nocheck
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Plus, X, FileText } from "lucide-react";
import { ConditionBadge } from "@/components/ConditionBadge";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";

interface QuoteItem {
  deviceVariantId: string;
  quantity: number;
  deviceName?: string;
  variantDetails?: string;
}

export default function RequestQuote() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [notes, setNotes] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { data: devices, isLoading: devicesLoading } = useQuery({
    queryKey: ["/api/catalog"],
  });

  const { data: variants } = useQuery({
    queryKey: ["/api/catalog/models", selectedDevice],
    enabled: !!selectedDevice,
  });

  const createQuoteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/quotes", {
        items: items.map(item => ({
          deviceVariantId: item.deviceVariantId,
          quantity: item.quantity,
        })),
        notes,
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({
        title: "Quote request submitted",
        description: `Quote ${data.quoteNumber} has been created. Our team will review and respond shortly.`,
      });
      setLocation("/buyer/quotes");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create quote request",
        variant: "destructive",
      });
    },
  });

  const addItem = () => {
    if (!selectedVariant || quantity < 1) {
      toast({
        title: "Invalid selection",
        description: "Please select a device variant and enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    const device = devices?.find((d: any) => d.id === selectedDevice);
    const variant = variants?.variants?.find((v: any) => v.id === selectedVariant);

    setItems([...items, {
      deviceVariantId: selectedVariant,
      quantity,
      deviceName: device?.marketingName || device?.brand + " " + device?.name,
      variantDetails: `${variant?.storage} | ${variant?.color} | Grade ${variant?.conditionGrade}`,
    }]);

    setSelectedDevice("");
    setSelectedVariant("");
    setQuantity(1);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: "No items",
        description: "Please add at least one item to your quote request",
        variant: "destructive",
      });
      return;
    }

    createQuoteMutation.mutate();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8 space-y-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Request Quote</h1>
              <p className="text-muted-foreground mt-1">
                Request custom pricing for bulk orders or special requirements
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Items to Quote</CardTitle>
            <CardDescription>Select devices and quantities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="device">Device</Label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger id="device" data-testid="select-device">
                  <SelectValue placeholder="Select a device" />
                </SelectTrigger>
                <SelectContent>
                  {devicesLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    devices?.map((device: any) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.marketingName || `${device.brand} ${device.name}`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedDevice && (
              <div className="space-y-2">
                <Label htmlFor="variant">Variant</Label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger id="variant" data-testid="select-variant">
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {variants?.variants?.map((variant: any) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.storage} | {variant.color} | Grade {variant.conditionGrade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                data-testid="input-quantity"
              />
            </div>

            <Button 
              type="button" 
              onClick={addItem} 
              className="w-full"
              disabled={!selectedVariant}
              data-testid="button-add-item"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Quote
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quote Items ({items.length})</CardTitle>
            <CardDescription>Review items before submitting</CardDescription>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No items added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start justify-between p-3 border rounded-md gap-3"
                    data-testid={`quote-item-${index}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.deviceName}</p>
                      <p className="text-sm text-muted-foreground">{item.variantDetails}</p>
                      <Badge variant="secondary" className="mt-1">Qty: {item.quantity}</Badge>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeItem(index)}
                      data-testid={`button-remove-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <CardDescription>
            Provide any special requirements or questions (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., urgent delivery needed, specific warranty requirements, payment terms, etc."
            rows={4}
            data-testid="textarea-notes"
          />
        </CardContent>
        <CardFooter className="flex gap-3 flex-wrap">
          <Button
            onClick={handleSubmit}
            disabled={items.length === 0 || createQuoteMutation.isPending}
            data-testid="button-submit-quote"
          >
            {createQuoteMutation.isPending ? "Submitting..." : "Submit Quote Request"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setLocation("/buyer/catalog")}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
            </CardFooter>
          </Card>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
