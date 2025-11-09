import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Smartphone, Check, ArrowRight, ShieldAlert, MapPin, Ship } from "lucide-react";
import {
  DeviceBrand,
  DeviceCondition,
  deviceConditions,
  carriers,
  shippingMethods,
  Carrier,
  ShippingMethod,
} from "@shared/schema";
import { deviceModels, calculatePrice, carrierLockStatus } from "@/lib/device-data";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const conditionDescriptions: Record<DeviceCondition, string> = {
  Excellent: "Flawless condition, looks brand new",
  Good: "Light wear with minor signs of use",
  Fair: "Fully functional with visible wear",
};

const authOptions = [
  { id: "google", label: "Continue with Google" },
  { id: "email", label: "Email & Password" },
  { id: "guest", label: "Guest Checkout" },
] as const;

const shippingKitFee = 10;

interface ShippingFormState {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
}

export function QuoteCalculator() {
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState<DeviceBrand | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);
  const [storage, setStorage] = useState<number | null>(null);
  const [condition, setCondition] = useState<DeviceCondition | null>(null);
  const [carrier, setCarrier] = useState<Carrier>("UNLOCKED");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("email-label");
  const [authMethod, setAuthMethod] = useState<(typeof authOptions)[number]["id"]>("guest");
  const [shippingForm, setShippingForm] = useState<ShippingFormState>({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const selectedModel = useMemo(() => deviceModels.find((m) => m.id === modelId), [modelId]);
  const quote = useMemo(() => {
    if (!modelId || !storage || !condition) return 0;
    return calculatePrice(modelId, storage, condition, carrier);
  }, [modelId, storage, condition, carrier]);

  const payoutAfterKit = useMemo(() => {
    const fee = shippingMethod === "shipping-kit" ? shippingKitFee : 0;
    return Math.max(quote - fee, 0);
  }, [quote, shippingMethod]);

  const submitQuoteMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/quotes", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error ?? "Unable to submit quote");
      }
      return await res.json();
    },
    onSuccess: (createdQuote) => {
      toast({
        title: "Quote secured!",
        description: "We've saved your order preferences for our admin team.",
      });
      resetQuote();
      navigate(`/thank-you/${createdQuote.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Submission failed",
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

  const handleCarrierSelect = (selectedCarrier: Carrier) => {
    setCarrier(selectedCarrier);
    setStep(6);
  };

  const handleGetQuoteNow = () => {
    if (quote <= 0) {
      toast({
        title: "Missing details",
        description: "Please complete the device details to continue.",
        variant: "destructive",
      });
      return;
    }
    setStep(7);
  };

  const handleShippingFormChange = (field: keyof ShippingFormState, value: string) => {
    setShippingForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateCheckout = () => {
    const requiredFields: (keyof ShippingFormState)[] = [
      "name",
      "email",
      "phone",
      "address1",
      "city",
      "state",
      "postalCode",
    ];

    for (const field of requiredFields) {
      if (!shippingForm[field]) {
        toast({
          title: "Missing information",
          description: "Please complete the shipping information before continuing.",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmitQuote = () => {
    if (!brand || !modelId || !selectedModel || !storage || !condition) return;
    if (!validateCheckout()) return;

    const orderNumber = `SHC-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
    const kitFee = shippingMethod === "shipping-kit" ? shippingKitFee : 0;

    submitQuoteMutation.mutate({
      brand,
      modelId,
      modelName: selectedModel.name,
      storage,
      condition,
      price: quote,
      customerName: shippingForm.name,
      customerEmail: shippingForm.email,
      customerPhone: shippingForm.phone,
      orderNumber,
      status: "pending",
      reviewEmailSent: false,
      workflow: {
        carrier,
        lockStatus: carrierLockStatus[carrier],
        shippingMethod,
        shippingKitFee: kitFee,
        payoutAmount: quote,
        totalDue: payoutAfterKit,
        trustpilotEligible: true,
        statusHistory: [
          {
            status: "pending",
            changedAt: new Date().toISOString(),
            note: "Quote created",
          },
        ],
        shippingInfo: {
          name: shippingForm.name,
          email: shippingForm.email,
          phone: shippingForm.phone,
          address1: shippingForm.address1,
          address2: shippingForm.address2 || undefined,
          city: shippingForm.city,
          state: shippingForm.state,
          postalCode: shippingForm.postalCode,
        },
        kitLabels: shippingMethod === "shipping-kit" ? {} : undefined,
        reminders: {
          status: "not_sent",
        },
        devicePhotos: [],
      },
    });
  };

  const resetQuote = () => {
    setStep(1);
    setBrand(null);
    setModelId(null);
    setStorage(null);
    setCondition(null);
    setCarrier("UNLOCKED");
    setShippingMethod("email-label");
    setAuthMethod("guest");
    setShippingForm({
      name: "",
      email: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
    });
  };

  const filteredModels = brand ? deviceModels.filter((m) => m.brand === brand) : [];
  const totalSteps = 7;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-t-xl">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-primary" />
            Get Your Instant Quote
          </CardTitle>
          <div className="flex gap-2 mt-4">
            {Array.from({ length: totalSteps }).map((_, index) => {
              const current = index + 1;
              return (
                <div
                  key={current}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    current <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="space-y-10 py-10">
          {step === 1 && (
            <div className="space-y-6">
              <Label className="text-lg">Select Device Brand</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["iPhone", "Samsung"].map((item) => (
                  <Card
                    key={item}
                    className={`cursor-pointer hover-elevate active-elevate-2 border-2 transition-all ${
                      brand === item ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => handleBrandSelect(item as DeviceBrand)}
                    data-testid={`card-brand-${item.toLowerCase()}`}
                  >
                    <CardContent className="p-8 text-center">
                      <Smartphone className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <h3 className="text-xl font-semibold">{item}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Alert className="border-secondary/40 bg-secondary/10">
                <ShieldAlert className="h-4 w-4 text-secondary" />
                <AlertTitle className="text-secondary">Device eligibility</AlertTitle>
                <AlertDescription className="text-sm">
                  We do not accept blacklisted phones and currently only buy devices from AT&amp;T, Verizon (VZW), T-Mobile (TMO), or fully unlocked devices.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {step >= 2 && brand && (
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
              <Select onValueChange={handleModelSelect} value={modelId ?? ""}>
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedModel.storageOptions.map((storageOption) => (
                  <Button
                    key={storageOption}
                    variant={storage === storageOption ? "default" : "outline"}
                    onClick={() => handleStorageSelect(storageOption.toString())}
                    data-testid={`button-storage-${storageOption}`}
                    className="py-6 text-lg"
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
                    className={`cursor-pointer hover-elevate active-elevate-2 transition-border border-2 ${
                      condition === cond ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => handleConditionSelect(cond)}
                    data-testid={`card-condition-${cond.toLowerCase()}`}
                  >
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{cond}</h4>
                        <p className="text-sm text-muted-foreground">
                          {conditionDescriptions[cond]}
                        </p>
                      </div>
                      {condition === cond && <Check className="h-6 w-6 text-primary" />}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step >= 5 && condition && (
            <div className="space-y-4">
              <Label className="text-lg">Condition Selected</Label>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {condition}
              </Badge>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <Label className="text-lg">Choose Carrier (locks pricing)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {carriers.map((carrierOption) => (
                  <Button
                    key={carrierOption}
                    variant={carrier === carrierOption ? "default" : "outline"}
                    onClick={() => handleCarrierSelect(carrierOption)}
                    className="py-6 text-lg"
                  >
                    {carrierOption}
                  </Button>
                ))}
              </div>
              <Alert variant="default" className="bg-accent border-primary/30">
                <ShieldAlert className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-semibold">Reminder</AlertTitle>
                <AlertDescription>
                  We can only process devices from AT&amp;T, Verizon, T-Mobile, or fully unlocked phones. Blacklisted or finance-locked devices are rejected automatically.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {step >= 6 && quote > 0 && (
            <div className="space-y-8">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8">
                <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-3">
                  Your Quote Summary
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-4xl font-bold text-primary" data-testid="text-quote-amount">
                      ${quote.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedModel?.name} • {storage}GB • {condition} • {carrier === "UNLOCKED" ? "Unlocked" : `${carrier} Locked`}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Shipping preference</span>
                      <span className="font-semibold capitalize">{shippingMethod.replace("-", " ")}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Shipping kit fee</span>
                      <span className="font-semibold">{shippingMethod === "shipping-kit" ? `$${shippingKitFee}` : "$0"}</span>
                    </div>
                    <Separator className="bg-primary/40" />
                    <div className="flex items-center justify-between text-base font-bold text-primary">
                      <span>Estimated payout</span>
                      <span>${payoutAfterKit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-dashed border-2 border-secondary/60">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <Ship className="h-5 w-5 text-secondary" />
                      <h3 className="text-lg font-semibold">Shipping Preferences</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose between a downloadable email label or a complete shipping kit delivered to your door.
                    </p>
                    <div className="flex flex-col gap-3">
                      {shippingMethods.map((method) => (
                        <Button
                          key={method}
                          variant={shippingMethod === method ? "secondary" : "outline"}
                          onClick={() => setShippingMethod(method)}
                          className="justify-between"
                        >
                          <span className="capitalize">{method.replace("-", " ")}</span>
                          {method === "shipping-kit" && <span className="text-xs">+$10 kit (inbound & outbound labels)</span>}
                          {method === "email-label" && <span className="text-xs text-muted-foreground">Free</span>}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/30">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Your next step</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      When you continue we’ll collect shipping details, let you check out as a guest or sign in, and secure your order.
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>ShipEngine compatible labels sent from the admin console</li>
                      <li>7-day &amp; 15-day reminders if a kit isn’t mailed back</li>
                      <li>Trustpilot review request after payout when applicable</li>
                    </ul>
                    <Button size="lg" className="w-full" onClick={handleGetQuoteNow}>
                      Get Quote Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-8">
              <div className="bg-muted/60 rounded-lg p-6">
                <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                  Finalize checkout
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">${payoutAfterKit.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">Guaranteed payout once your device passes inspection.</p>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Carrier: <span className="font-semibold text-foreground">{carrier}</span></p>
                    <p>Lock status: <span className="font-semibold text-foreground">{carrierLockStatus[carrier]}</span></p>
                    <p>Shipping option: <span className="font-semibold text-foreground capitalize">{shippingMethod.replace("-", " ")}</span></p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="font-semibold">Sign-in preference</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose how you’d like to manage your order. Guest checkout still collects your shipping details securely.
                    </p>
                    <div className="flex flex-col gap-2">
                      {authOptions.map((option) => (
                        <Button
                          key={option.id}
                          variant={authMethod === option.id ? "default" : "outline"}
                          onClick={() => setAuthMethod(option.id)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                    {authMethod !== "guest" && (
                      <Alert className="bg-primary/5 border-primary/30">
                        <AlertDescription className="text-xs">
                          Full authentication is coming soon. For now we’ll reserve your order using the contact information you provide below.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold">Shipping information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkout-name">Full name</Label>
                        <Input
                          id="checkout-name"
                          value={shippingForm.name}
                          onChange={(event) => handleShippingFormChange("name", event.target.value)}
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout-email">Email</Label>
                        <Input
                          id="checkout-email"
                          type="email"
                          value={shippingForm.email}
                          onChange={(event) => handleShippingFormChange("email", event.target.value)}
                          placeholder="you@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout-phone">Phone</Label>
                        <Input
                          id="checkout-phone"
                          value={shippingForm.phone}
                          onChange={(event) => handleShippingFormChange("phone", event.target.value)}
                          placeholder="(555) 555-1234"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout-address1">Address</Label>
                        <Input
                          id="checkout-address1"
                          value={shippingForm.address1}
                          onChange={(event) => handleShippingFormChange("address1", event.target.value)}
                          placeholder="123 Market Street"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout-address2">Apartment / Suite (optional)</Label>
                        <Input
                          id="checkout-address2"
                          value={shippingForm.address2}
                          onChange={(event) => handleShippingFormChange("address2", event.target.value)}
                          placeholder="Unit 4B"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout-city">City</Label>
                        <Input
                          id="checkout-city"
                          value={shippingForm.city}
                          onChange={(event) => handleShippingFormChange("city", event.target.value)}
                          placeholder="Orlando"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout-state">State</Label>
                        <Input
                          id="checkout-state"
                          value={shippingForm.state}
                          onChange={(event) => handleShippingFormChange("state", event.target.value)}
                          placeholder="FL"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout-postal">Postal Code</Label>
                        <Input
                          id="checkout-postal"
                          value={shippingForm.postalCode}
                          onChange={(event) => handleShippingFormChange("postalCode", event.target.value)}
                          placeholder="32801"
                        />
                      </div>
                    </div>
                    <Alert className="bg-secondary/10 border-secondary/40">
                      <AlertTitle className="text-secondary font-semibold">Shipping kit reminder policy</AlertTitle>
                      <AlertDescription className="text-sm">
                        If you choose the $10 shipping kit our admin team will generate both outbound and inbound ShipEngine labels. We send a reminder 7 days after the kit arrives and cancel the order 15 days later if the device never ships back.
                      </AlertDescription>
                    </Alert>
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
                      <Button variant="outline" onClick={() => setStep(6)}>
                        Back to quote
                      </Button>
                      <Button
                        size="lg"
                        className="sm:min-w-[220px]"
                        onClick={handleSubmitQuote}
                        disabled={submitQuoteMutation.isPending}
                        data-testid="button-submit-quote"
                      >
                        {submitQuoteMutation.isPending ? "Saving..." : "Secure my order"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
