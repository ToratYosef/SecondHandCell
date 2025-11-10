import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GlassCard from "./GlassCard";
import { ShoppingCart } from "lucide-react";
import type { StaticImageData } from "next/image";

interface ProductCardProps {
  id: string;
  title: string;
  brand: string;
  image: string | StaticImageData;
  grade: string;
  price: number;
  originalPrice?: number;
  stock: number;
  onClick?: () => void;
}

export default function ProductCard({
  title,
  brand,
  image,
  grade,
  price,
  originalPrice,
  stock,
  onClick,
}: ProductCardProps) {
  const gradeColors = {
    A: "bg-green-500/90 text-white",
    B: "bg-blue-500/90 text-white",
    C: "bg-yellow-500/90 text-white",
  };
  const resolvedImage = typeof image === "string" ? image : image.src;

  return (
    <GlassCard className="group cursor-pointer hover-elevate transition-transform hover:scale-[1.02]" onClick={onClick}>
      <div className="p-6" data-testid={`card-product-${title}`}>
        <div className="aspect-square relative mb-4 bg-white/50 dark:bg-white/10 rounded-xl overflow-hidden">
          <img
            src={resolvedImage}
            alt={title}
            className="w-full h-full object-contain p-4"
          />
          <Badge className={`absolute top-2 right-2 ${gradeColors[grade as keyof typeof gradeColors] || gradeColors.B}`}>
            Grade {grade}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{brand}</p>
            <h3 className="font-semibold text-lg text-white dark:text-white line-clamp-2">{title}</h3>
          </div>
          
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-white dark:text-white tabular-nums">
              ${(price / 100).toFixed(2)}
            </p>
            {originalPrice && (
              <p className="text-sm text-white/60 dark:text-white/60 line-through tabular-nums">
                ${(originalPrice / 100).toFixed(2)}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-white/80 dark:text-white/80">
              {stock > 10 ? 'In Stock' : `Only ${stock} left`}
            </p>
            <Button size="sm" variant="secondary" data-testid="button-add-to-cart">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
