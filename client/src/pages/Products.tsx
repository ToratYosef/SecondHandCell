import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import GlassCard from "@/components/GlassCard";
import iphoneBlue from '@assets/generated_images/iPhone_13_Pro_Blue_b5275bdb.png';
import iphoneBlack from '@assets/generated_images/iPhone_13_Pro_Black_0adbf2a8.png';
import galaxyS21 from '@assets/generated_images/Samsung_Galaxy_S21_Ultra_b0ff5079.png';
import pixel7 from '@assets/generated_images/Google_Pixel_7_Pro_7213306e.png';

export default function Products() {
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // todo: remove mock functionality
  const products = [
    {
      id: 'iphone-13-pro-blue',
      title: 'iPhone 13 Pro 128GB - Blue',
      brand: 'Apple',
      image: iphoneBlue,
      grade: 'A',
      price: 64900,
      originalPrice: 79900,
      stock: 12,
    },
    {
      id: 'iphone-13-pro-black',
      title: 'iPhone 13 Pro 256GB - Black',
      brand: 'Apple',
      image: iphoneBlack,
      grade: 'A',
      price: 74900,
      originalPrice: 89900,
      stock: 8,
    },
    {
      id: 'galaxy-s21-ultra',
      title: 'Samsung Galaxy S21 Ultra 256GB',
      brand: 'Samsung',
      image: galaxyS21,
      grade: 'B',
      price: 59900,
      originalPrice: 74900,
      stock: 15,
    },
    {
      id: 'pixel-7-pro',
      title: 'Google Pixel 7 Pro 128GB',
      brand: 'Google',
      image: pixel7,
      grade: 'A',
      price: 54900,
      originalPrice: 69900,
      stock: 20,
    },
    {
      id: 'iphone-13-pro-blue-2',
      title: 'iPhone 13 Pro 512GB - Blue',
      brand: 'Apple',
      image: iphoneBlue,
      grade: 'B',
      price: 79900,
      originalPrice: 99900,
      stock: 5,
    },
    {
      id: 'pixel-7-pro-2',
      title: 'Google Pixel 7 Pro 256GB',
      brand: 'Google',
      image: pixel7,
      grade: 'B',
      price: 59900,
      originalPrice: 74900,
      stock: 10,
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">Browse our complete selection of refurbished smartphones</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <GlassCard className="sticky top-24 bg-gradient-to-br from-blue-600/10 to-purple-600/10">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Brand</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox id="apple" data-testid="checkbox-apple" />
                      <Label htmlFor="apple" className="cursor-pointer">Apple</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="samsung" data-testid="checkbox-samsung" />
                      <Label htmlFor="samsung" className="cursor-pointer">Samsung</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="google" data-testid="checkbox-google" />
                      <Label htmlFor="google" className="cursor-pointer">Google</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Condition Grade</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox id="grade-a" data-testid="checkbox-grade-a" />
                      <Label htmlFor="grade-a" className="cursor-pointer">Grade A - Excellent</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="grade-b" data-testid="checkbox-grade-b" />
                      <Label htmlFor="grade-b" className="cursor-pointer">Grade B - Good</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="grade-c" data-testid="checkbox-grade-c" />
                      <Label htmlFor="grade-c" className="cursor-pointer">Grade C - Fair</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    step={10}
                    className="mb-2"
                    data-testid="slider-price"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" data-testid="button-clear-filters">
                  Clear Filters
                </Button>
              </div>
            </GlassCard>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} products
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="grade">Best Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-gradient-to-br from-blue-600 to-purple-600 p-1 rounded-2xl">
                  <ProductCard
                    {...product}
                    onClick={() => console.log('Navigate to product:', product.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
