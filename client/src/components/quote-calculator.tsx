import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Check } from "lucide-react";
import { DeviceBrand, DeviceCondition, deviceConditions } from "@shared/schema";
import { deviceModels, calculatePrice } from "@/lib/device-data";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const conditionDescriptions: Record<DeviceCondition, string> = {
  "Excellent": "Like new, no scratches or damage",
  "Good": "Minor wear, fully functional",
  "Fair": "Visible wear, some scratches, works fine",
};

export function QuoteCalculator() {
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState<DeviceBrand | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);
  const [storage, setStorage] = useState<number | null>(null);
  const [condition, setCondition] = useState<DeviceCondition | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const { toast } = useToast();

  const selectedModel = deviceModels.find(m => m.id === modelId);
  const quote = modelId && storage && condition 
    ? calculatePrice(modelId, storage, condition)
    : 0;

  const submitQuoteMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/quotes", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Quote Submitted!",
        description: "We'll send you a shipping label via email shortly.",
      });
      setStep(6);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit quote",
        variant: "destructive",
      });
    },
  });

  const handleBrandSelect = (selectedBrand: DeviceBrand) => {
    setBrand(selectedBrand);
    setModelId(null);
    setStorage(null);
    setCondition(null);
    setStep(2);
  };

  const handleModelSelect = (selectedModelId: string) => {
    setModelId(selectedModelId);
    setStorage(null);
    setCondition(null);
    setStep(3);
  };

  const handleStorageSelect = (selectedStorage: string) => {
    setStorage(parseInt(selectedStorage));
    setCondition(null);
    setStep(4);
  };

  const handleConditionSelect = (selectedCondition: DeviceCondition) => {
    setCondition(selectedCondition);
    setStep(5);
  };

  const handleSubmitQuote = () => {
    if (!brand || !modelId || !selectedModel || !storage || !condition) return;

    submitQuoteMutation.mutate({
      brand,
      modelId,
      modelName: selectedModel.name,
      storage,
      condition,
      price: quote,
      customerName: customerName || undefined,
      customerEmail: customerEmail || undefined,
      status: "pending",
    });
  };

  const resetQuote = () => {
    setStep(1);
    setBrand(null);
    setModelId(null);
    setStorage(null);
    setCondition(null);
    setCustomerName("");
    setCustomerEmail("");
  };

  const filteredModels = brand 
    ? deviceModels.filter(m => m.brand === brand)
    : [];

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Get Your Instant Quote</CardTitle>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {step === 1 && (
            <div className="space-y-4">
              <Label className="text-lg">Select Device Brand</Label>
              <div className="grid grid-cols-2 gap-4">
                <Card 
                  className="cursor-pointer hover-elevate active-elevate-2"
                  onClick={() => handleBrandSelect("iPhone")}
                  data-testid="card-brand-iphone"
                >
                  <CardContent className="p-8 text-center">
                    <Smartphone className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-semibold">iPhone</h3>
                  </CardContent>
                </Card>
                <Card 
                  className="cursor-pointer hover-elevate active-elevate-2"
                  onClick={() => handleBrandSelect("Samsung")}
                  data-testid="card-brand-samsung"
                >
                  <CardContent className="p-8 text-center">
                    <Smartphone className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-semibold">Samsung</h3>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {step >= 2 && (
            <div className="space-y-4">
              <Label className="text-lg">Selected Brand</Label>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {brand}
              </Badge>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label className="text-lg">Select Model</Label>
              <Select onValueChange={handleModelSelect} value={modelId || ""}>
                <SelectTrigger data-testid="select-model">
                  <SelectValue placeholder="Choose your device model" />
                </SelectTrigger>
                <SelectContent>
                  {filteredModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step >= 3 && selectedModel && (
            <div className="space-y-4">
              <Label className="text-lg">Selected Model</Label>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {selectedModel.name}
              </Badge>
            </div>
          )}

          {step === 3 && selectedModel && (
            <div className="space-y-4">
              <Label className="text-lg">Select Storage</Label>
              <div className="grid grid-cols-3 gap-4">
                {selectedModel.storageOptions.map((storageOption) => (
                  <Button
                    key={storageOption}
                    variant={storage === storageOption ? "default" : "outline"}
                    onClick={() => handleStorageSelect(storageOption.toString())}
                    data-testid={`button-storage-${storageOption}`}
                  >
                    {storageOption >= 1000 ? `${storageOption / 1000}TB` : `${storageOption}GB`}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step >= 4 && storage && (
            <div className="space-y-4">
              <Label className="text-lg">Selected Storage</Label>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {storage >= 1000 ? `${storage / 1000}TB` : `${storage}GB`}
              </Badge>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Label className="text-lg">Select Condition</Label>
              <div className="space-y-3">
                {deviceConditions.map((cond) => (
                  <Card
                    key={cond}
                    className={`cursor-pointer hover-elevate active-elevate-2 ${
                      condition === cond ? 'border-primary' : ''
                    }`}
                    onClick={() => handleConditionSelect(cond)}
                    data-testid={`card-condition-${cond.toLowerCase()}`}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{cond}</h4>
                        <p className="text-sm text-muted-foreground">
                          {conditionDescriptions[cond]}
                        </p>
                      </div>
                      {condition === cond && (
                        <Check className="h-6 w-6 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === 5 && quote > 0 && (
            <div className="space-y-6">
              <div className="bg-primary/10 rounded-lg p-8 text-center">
                <p className="text-lg mb-2">Your Quote</p>
                <p className="text-5xl font-bold text-primary mb-4" data-testid="text-quote-amount">
                  ${quote}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedModel?.name} • {storage}GB • {condition} Condition
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Free shipping included</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Payment within 2 business days</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Price match guarantee</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label className="text-base">Contact Information (Optional)</Label>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="customer-name" className="text-sm">Name</Label>
                    <Input
                      id="customer-name"
                      placeholder="Your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      data-testid="input-customer-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-email" className="text-sm">Email</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="your@email.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      data-testid="input-customer-email"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleSubmitQuote}
                  disabled={submitQuoteMutation.isPending}
                  data-testid="button-accept-quote"
                >
                  {submitQuoteMutation.isPending ? "Submitting..." : "Accept Quote"}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={resetQuote}
                  data-testid="button-new-quote"
                >
                  New Quote
                </Button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Quote Submitted Successfully!</h3>
                <p className="text-muted-foreground mb-6">
                  We'll send you a prepaid shipping label via email shortly. Pack your device securely and ship it to us.
                </p>
                <div className="bg-muted/50 rounded-lg p-6 mb-6">
                  <p className="text-sm font-semibold mb-2">Your Quote Details:</p>
                  <p className="text-3xl font-bold text-primary mb-2">${quote}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedModel?.name} • {storage}GB • {condition} Condition
                  </p>
                </div>
              </div>
              <Button onClick={resetQuote} data-testid="button-another-quote">
                Get Another Quote
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
