import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Variant {
  id: string;
  capacity: number;
  grade: string;
  network: string;
  price: number;
  stock: number;
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant;
  onVariantChange: (variant: Variant) => void;
}

export default function VariantSelector({ variants, selectedVariant, onVariantChange }: VariantSelectorProps) {
  const capacities = Array.from(new Set(variants.map(v => v.capacity)));
  const grades = Array.from(new Set(variants.filter(v => v.capacity === selectedVariant.capacity).map(v => v.grade)));
  const networks = Array.from(new Set(variants.filter(v => v.capacity === selectedVariant.capacity && v.grade === selectedVariant.grade).map(v => v.network)));

  const handleCapacityChange = (capacity: number) => {
    const newVariant = variants.find(v => v.capacity === capacity) || variants[0];
    onVariantChange(newVariant);
  };

  const handleGradeChange = (grade: string) => {
    const newVariant = variants.find(v => 
      v.capacity === selectedVariant.capacity && v.grade === grade
    ) || selectedVariant;
    onVariantChange(newVariant);
  };

  const handleNetworkChange = (network: string) => {
    const newVariant = variants.find(v => 
      v.capacity === selectedVariant.capacity && 
      v.grade === selectedVariant.grade && 
      v.network === network
    ) || selectedVariant;
    onVariantChange(newVariant);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-3 block">Storage Capacity</label>
        <div className="flex flex-wrap gap-2">
          {capacities.map(capacity => (
            <Button
              key={capacity}
              variant={selectedVariant.capacity === capacity ? "default" : "outline"}
              onClick={() => handleCapacityChange(capacity)}
              data-testid={`button-capacity-${capacity}`}
            >
              {capacity}GB
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-3 block">Condition Grade</label>
        <Select value={selectedVariant.grade} onValueChange={handleGradeChange}>
          <SelectTrigger data-testid="select-grade">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {grades.map(grade => (
              <SelectItem key={grade} value={grade}>
                Grade {grade} - {grade === 'A' ? 'Excellent' : grade === 'B' ? 'Good' : 'Fair'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-3 block">Network</label>
        <Select value={selectedVariant.network} onValueChange={handleNetworkChange}>
          <SelectTrigger data-testid="select-network">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {networks.map(network => (
              <SelectItem key={network} value={network}>
                {network}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
