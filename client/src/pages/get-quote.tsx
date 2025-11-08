import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { QuoteCalculator } from "@/components/quote-calculator";

export default function GetQuote() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get Your Instant Quote
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer a few quick questions about your device and get an accurate price estimate
            </p>
          </div>
          <QuoteCalculator />
        </div>
      </main>
      <Footer />
    </div>
  );
}
