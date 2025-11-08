import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import avatar1 from "@assets/generated_images/Customer_testimonial_avatar_woman_3341efb5.png";
import avatar2 from "@assets/generated_images/Customer_testimonial_avatar_man_0d5d4bd7.png";
import avatar3 from "@assets/generated_images/Customer_testimonial_avatar_professional_20d46d87.png";

const testimonials = [
  {
    name: "Sarah Mitchell",
    device: "iPhone 14 Pro",
    avatar: avatar1,
    rating: 5,
    text: "Super easy process! Got my quote instantly and received payment within 48 hours. Highly recommend!",
  },
  {
    name: "Michael Chen",
    device: "Galaxy S23 Ultra",
    avatar: avatar2,
    rating: 5,
    text: "Best price I could find for my Samsung. The whole process was transparent and professional.",
  },
  {
    name: "Jessica Parker",
    device: "iPhone 13",
    avatar: avatar3,
    rating: 5,
    text: "Impressed with how smooth everything was. Free shipping and fast payment made it stress-free.",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our customers have to say
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-testimonial-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">Sold {testimonial.device}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
