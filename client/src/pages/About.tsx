import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, TrendingUp, CheckCircle2 } from "lucide-react";

export default function About() {
  const team = [
    {
      role: "Head of Purchasing",
      description: "Oversees all supplier relationships and inventory acquisition strategy, ensuring competitive pricing and quality standards.",
    },
    {
      role: "Operations Director",
      description: "Manages warehouse operations, logistics partnerships, and fulfillment processes to deliver orders within 24-48 hours.",
    },
    {
      role: "Quality Assurance Lead",
      description: "Leads the device testing and grading team, maintaining rigorous quality control protocols for every unit.",
    },
  ];

  const milestones = [
    { year: "2019", event: "Company founded with mission to bring transparency to wholesale device market" },
    { year: "2020", event: "Reached 500+ wholesale customers and expanded to second warehouse facility" },
    { year: "2021", event: "Launched tiered pricing platform and introduced net terms for qualified buyers" },
    { year: "2022", event: "Processed 100,000+ devices and achieved 99% customer satisfaction rating" },
    { year: "2023", event: "Opened third distribution center and expanded inventory to 15,000+ SKUs" },
  ];

  const grades = [
    {
      grade: "A",
      title: "Grade A - Excellent",
      description: "Minimal to no signs of wear. Screen is flawless. Full functionality verified. Cosmetically pristine with no visible scratches.",
    },
    {
      grade: "B",
      title: "Grade B - Very Good",
      description: "Light signs of use. Minor cosmetic marks that don't affect functionality. Screen may have very light micro-scratches only visible at certain angles.",
    },
    {
      grade: "C",
      title: "Grade C - Good",
      description: "Moderate signs of use with visible scratches or scuffs on body. Screen has light scratches. All features fully functional.",
    },
    {
      grade: "D",
      title: "Grade D - Fair",
      description: "Heavy signs of use with obvious cosmetic wear. May have dents, deep scratches, or discoloration. All core functions work properly.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-muted/30 py-16 lg:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-5xl" data-testid="text-about-headline">
                About SecondHand(Whole)Cell
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                We're on a mission to make wholesale device procurement transparent, reliable, and profitable for businesses of all sizes.
              </p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16 lg:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-3xl font-semibold lg:text-4xl" data-testid="text-our-story">
                Our Story
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  SecondHand(Whole)Cell was founded in 2019 by a team of mobile industry veterans who saw firsthand how opaque and unreliable the wholesale used device market had become. Buyers were forced to navigate inconsistent grading, surprise fees, and unpredictable inventory.
                </p>
                <p>
                  We built SecondHand(Whole)Cell to solve these problems. Our platform combines rigorous device testing, transparent tiered pricing, and real-time inventory visibility to give wholesale buyers the confidence they need to scale their operations.
                </p>
                <p>
                  Today, we serve over 2,000 wholesale customers—from small repair shops to large-scale refurbishers—processing tens of thousands of devices each month. Our commitment to quality, transparency, and customer service remains at the heart of everything we do.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Grading Standards */}
        <section className="border-t bg-muted/30 py-16 lg:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-semibold lg:text-4xl" data-testid="text-grading-standards">
                Our Grading Standards
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
                Every device is inspected by certified technicians using a 60+ point quality checklist
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              {grades.map((grade) => (
                <Card key={grade.grade} data-testid={`card-grade-${grade.grade}`}>
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant={grade.grade === "A" || grade.grade === "B" ? "default" : "secondary"}>
                        {grade.grade}
                      </Badge>
                      <CardTitle className="text-lg">{grade.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">{grade.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="border-t py-16 lg:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-semibold lg:text-4xl" data-testid="text-team">
                Leadership Team
              </h2>
            </div>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
              {team.map((member, index) => (
                <Card key={index} data-testid={`card-team-${index}`}>
                  <CardHeader>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{member.role}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">{member.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="border-t bg-muted/30 py-16 lg:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-semibold lg:text-4xl" data-testid="text-milestones">
                Our Journey
              </h2>
            </div>
            <div className="mx-auto max-w-3xl space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6" data-testid={`milestone-${index}`}>
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-sm font-semibold">
                      {milestone.year.slice(2)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="mt-2 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="mb-1 font-mono text-sm font-semibold text-primary">{milestone.year}</div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-t py-16 lg:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-semibold lg:text-4xl" data-testid="text-values">
                Our Values
              </h2>
            </div>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              <div className="text-center" data-testid="value-transparency">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Transparency</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Clear pricing, honest grading, and no hidden fees. What you see is what you get.
                </p>
              </div>
              <div className="text-center" data-testid="value-quality">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Quality</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Rigorous testing and consistent grading standards ensure reliable products every time.
                </p>
              </div>
              <div className="text-center" data-testid="value-growth">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Partnership</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Your success drives ours. We're committed to helping wholesale buyers grow profitably.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
