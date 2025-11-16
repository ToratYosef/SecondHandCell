import { Link } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Mail } from "lucide-react";

export default function RegisterThanks() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      
      <main className="flex flex-1 items-center justify-center py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-2xl">
            <CardHeader className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl" data-testid="text-thanks-title">
                Application Received!
              </CardTitle>
              <CardDescription>
                Thank you for applying to SecondHand(Whole)Cell wholesale program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center leading-relaxed text-muted-foreground">
                Your application has been received. Our team will review your account typically within one business day.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Review Process</h3>
                    <p className="text-sm text-muted-foreground">
                      Our team is reviewing your business information and documentation
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Approval Email</h3>
                    <p className="text-sm text-muted-foreground">
                      You'll receive an email with login instructions once your account is approved
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Start Ordering</h3>
                    <p className="text-sm text-muted-foreground">
                      Once approved, you'll have full access to wholesale pricing and inventory
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <Button asChild data-testid="button-back-home">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
