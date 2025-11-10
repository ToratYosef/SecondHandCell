import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VariantSelector from "@/components/VariantSelector";
import PriceTierTable from "@/components/PriceTierTable";
import { ShoppingCart, Shield, Truck, RefreshCw } from "lucide-react";
import type { StaticImageData } from "next/image";
import iphoneBlue from '@assets/generated_images/iPhone_13_Pro_Blue_b5275bdb.png';

const toImageSrc = (value: string | StaticImageData) => (typeof value === "string" ? value : value.src);

export default function ProductDetail() {
  // todo: remove mock functionality
  const variants = [
    { id: '1', capacity: 128, grade: 'A', network: 'Unlocked', price: 64900, stock: 12 },
    { id: '2', capacity: 128, grade: 'B', network: 'Unlocked', price: 59900, stock: 8 },
    { id: '3', capacity: 256, grade: 'A', network: 'Unlocked', price: 74900, stock: 5 },
    { id: '4', capacity: 256, grade: 'B', network: 'Unlocked', price: 69900, stock: 10 },
  ];

  const priceTiers = [
    { minQty: 1, maxQty: 4, pricePerUnit: 64900 },
    { minQty: 5, maxQty: 19, pricePerUnit: 62900 },
    { minQty: 20, pricePerUnit: 60900 },
  ];

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="aspect-square bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 mb-4 relative">
              <img
                src={toImageSrc(iphoneBlue)}
                alt="iPhone 13 Pro"
                className="w-full h-full object-contain"
              />
              <Badge className="absolute top-4 right-4 bg-green-500/90 text-white">
                Grade {selectedVariant.grade}
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover-elevate" data-testid={`thumbnail-${i}`}>
                  <img
                    src={toImageSrc(iphoneBlue)}
                    alt={`View ${i}`}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Apple</p>
              <h1 className="text-4xl font-bold mb-4">iPhone 13 Pro - Blue</h1>
              <p className="text-3xl font-bold mb-2">${(selectedVariant.price / 100).toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                {selectedVariant.stock > 10 ? 'In Stock' : `Only ${selectedVariant.stock} left in stock`}
              </p>
            </div>

            <div className="space-y-4 p-6 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">90-day warranty included</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">Free shipping on orders over $500</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-primary" />
                <span className="text-sm">30-day return policy</span>
              </div>
            </div>

            <VariantSelector
              variants={variants}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
            />

            <div>
              <Label className="text-sm font-medium mb-3 block">Quantity</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    data-testid="button-decrease-quantity"
                  >
                    -
                  </Button>
                  <span className="text-lg font-medium w-12 text-center" data-testid="text-quantity">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    data-testid="button-increase-quantity"
                  >
                    +
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Total: ${((selectedVariant.price * quantity) / 100).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1" data-testid="button-add-to-cart">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" data-testid="button-buy-now">
                Buy Now
              </Button>
            </div>

            <PriceTierTable tiers={priceTiers} currentQty={quantity} />
          </div>
        </div>

        <Tabs defaultValue="description" className="mb-12">
          <TabsList>
            <TabsTrigger value="description" data-testid="tab-description">Description</TabsTrigger>
            <TabsTrigger value="specs" data-testid="tab-specs">Specifications</TabsTrigger>
            <TabsTrigger value="condition" data-testid="tab-condition">Condition Details</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="space-y-4 py-6">
            <h3 className="text-2xl font-semibold">Product Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              The iPhone 13 Pro features a stunning 6.1-inch Super Retina XDR display with ProMotion technology. 
              This refurbished device has been professionally tested and certified to work like new. 
              It includes the original charging cable and has been thoroughly cleaned and sanitized.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Powered by the A15 Bionic chip, this phone delivers incredible performance for gaming, 
              photography, and everyday tasks. The triple-camera system captures stunning photos and videos 
              in any lighting condition.
            </p>
          </TabsContent>
          <TabsContent value="specs" className="py-6">
            <h3 className="text-2xl font-semibold mb-4">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Display</span>
                  <span className="font-medium">6.1" Super Retina XDR</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Processor</span>
                  <span className="font-medium">A15 Bionic</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Camera</span>
                  <span className="font-medium">12MP Triple Camera</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Battery</span>
                  <span className="font-medium">Up to 22 hours video</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">204g</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">5G</span>
                  <span className="font-medium">Yes</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="condition" className="space-y-4 py-6">
            <h3 className="text-2xl font-semibold">Grade A Condition</h3>
            <p className="text-muted-foreground leading-relaxed">
              Grade A devices are in excellent cosmetic condition with minimal signs of wear. 
              The screen is free from scratches and the body shows only light micro-scratches that 
              are only visible under close inspection.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Screen: Excellent condition, no scratches</li>
              <li>Body: Light micro-scratches only</li>
              <li>Battery Health: Minimum 85%</li>
              <li>Fully functional, tested working</li>
              <li>Professionally cleaned and sanitized</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { Label } from "@/components/ui/label";
