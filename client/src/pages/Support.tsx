import { useState } from "react";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Clock, MessageCircle } from "lucide-react";

export default function Support() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real implementation, this would create a support ticket
    setSubmitted(true);
    toast({
      title: "Support request submitted",
      description: "We'll get back to you within 24 hours.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      
      <main className="flex-1">
        {/* Header */}
        <section className="border-b bg-muted/30 py-16 lg:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl" data-testid="text-support-headline">
                Support & Contact
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Our team is here to help you succeed with your wholesale purchasing
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
              {/* Contact Information */}
              <div>
                <h2 className="mb-6 text-2xl font-semibold" data-testid="text-contact-info">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>Email Support</CardTitle>
                      <CardDescription>support@secondhandwholecell.com</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        For general inquiries and existing customer support
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>Business Hours</CardTitle>
                      <CardDescription>Monday - Friday, 9AM - 6PM EST</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Typical response time: Within 2-4 hours during business hours
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <MessageCircle className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>Live Chat</CardTitle>
                      <CardDescription>Available for logged-in wholesale customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Access live chat support from your account dashboard
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="mb-6 text-2xl font-semibold" data-testid="text-contact-form">
                  Send Us a Message
                </h2>
                {submitted ? (
                  <Card className="bg-primary/5">
                    <CardHeader>
                      <CardTitle>Thank you for contacting us!</CardTitle>
                      <CardDescription>
                        We've received your message and will respond within 24 hours.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => setSubmitted(false)} data-testid="button-submit-another">
                        Submit Another Request
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            data-testid="input-name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            data-testid="input-email"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company">Company (Optional)</Label>
                          <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            data-testid="input-company"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            data-testid="input-subject"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={6}
                            required
                            data-testid="input-message"
                          />
                        </div>

                        <Button type="submit" className="w-full" data-testid="button-submit">
                          Submit Request
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
