import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Account details
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Company details
    companyName: "",
    legalName: "",
    website: "",
    taxId: "",
    businessType: "",
    resellerCertificate: null as File | null,
    // Address
    contactName: "",
    addressPhone: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Will be implemented in backend integration
    toast({
      title: "Registration submitted",
      description: "Redirecting to confirmation page...",
    });
    setTimeout(() => setLocation("/register/thanks"), 1000);
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, resellerCertificate: file }));
  };

  const progress = (step / 3) * 100;

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      
      <main className="flex flex-1 items-center justify-center py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl" data-testid="text-register-title">
                Apply for Wholesale Account
              </CardTitle>
              <CardDescription>
                Step {step} of 3
              </CardDescription>
              <Progress value={progress} className="mt-4" />
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Account Details */}
                {step === 1 && (
                  <div className="space-y-4" data-testid="step-account">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Account Details</h3>
                      <p className="text-sm text-muted-foreground">Create your login credentials</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                        data-testid="input-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        required
                        data-testid="input-phone"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        required
                        data-testid="input-password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        required
                        data-testid="input-confirm-password"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Company Details */}
                {step === 2 && (
                  <div className="space-y-4" data-testid="step-company">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Company Information</h3>
                      <p className="text-sm text-muted-foreground">Tell us about your business</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleChange("companyName", e.target.value)}
                        required
                        data-testid="input-company-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="legalName">Legal Name *</Label>
                      <Input
                        id="legalName"
                        value={formData.legalName}
                        onChange={(e) => handleChange("legalName", e.target.value)}
                        required
                        data-testid="input-legal-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://"
                        value={formData.website}
                        onChange={(e) => handleChange("website", e.target.value)}
                        data-testid="input-website"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID / EIN</Label>
                      <Input
                        id="taxId"
                        value={formData.taxId}
                        onChange={(e) => handleChange("taxId", e.target.value)}
                        data-testid="input-tax-id"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) => handleChange("businessType", value)}
                        required
                      >
                        <SelectTrigger id="businessType" data-testid="select-business-type">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail_store">Retail Store</SelectItem>
                          <SelectItem value="online_only">Online-Only</SelectItem>
                          <SelectItem value="wholesaler">Wholesaler</SelectItem>
                          <SelectItem value="repair_shop">Repair Shop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resellerCertificate">Reseller Certificate (Optional)</Label>
                      <Input
                        id="resellerCertificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        data-testid="input-reseller-certificate"
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload PDF, JPG, or PNG (if applicable)
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Shipping Address */}
                {step === 3 && (
                  <div className="space-y-4" data-testid="step-address">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">First Shipping Address</h3>
                      <p className="text-sm text-muted-foreground">Where should we send your orders?</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => handleChange("contactName", e.target.value)}
                        required
                        data-testid="input-contact-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressPhone">Phone *</Label>
                      <Input
                        id="addressPhone"
                        type="tel"
                        value={formData.addressPhone}
                        onChange={(e) => handleChange("addressPhone", e.target.value)}
                        required
                        data-testid="input-address-phone"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street1">Street Address *</Label>
                      <Input
                        id="street1"
                        value={formData.street1}
                        onChange={(e) => handleChange("street1", e.target.value)}
                        required
                        data-testid="input-street1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street2">Apt, Suite, etc. (Optional)</Label>
                      <Input
                        id="street2"
                        value={formData.street2}
                        onChange={(e) => handleChange("street2", e.target.value)}
                        data-testid="input-street2"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          required
                          data-testid="input-city"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleChange("state", e.target.value)}
                          required
                          data-testid="input-state"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">ZIP Code *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleChange("postalCode", e.target.value)}
                        required
                        data-testid="input-postal-code"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={handleBack} data-testid="button-back">
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <Button type="button" onClick={handleNext} data-testid="button-next">
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" data-testid="button-submit">
                      Submit Application
                    </Button>
                  )}
                </div>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <Link href="/login" className="text-primary hover:underline" data-testid="link-login">
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
