import VariantSelector from '../VariantSelector';
import { useState } from 'react';

export default function VariantSelectorExample() {
  const variants = [
    { id: '1', capacity: 128, grade: 'A', network: 'Unlocked', price: 64900, stock: 12 },
    { id: '2', capacity: 128, grade: 'B', network: 'Unlocked', price: 59900, stock: 8 },
    { id: '3', capacity: 256, grade: 'A', network: 'Unlocked', price: 74900, stock: 5 },
    { id: '4', capacity: 256, grade: 'B', network: 'Unlocked', price: 69900, stock: 10 },
    { id: '5', capacity: 128, grade: 'A', network: 'AT&T', price: 62900, stock: 6 },
  ];

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  return (
    <div className="p-8 max-w-md bg-card">
      <VariantSelector
        variants={variants}
        selectedVariant={selectedVariant}
        onVariantChange={(v) => {
          setSelectedVariant(v);
          console.log('Variant changed:', v);
        }}
      />
      <div className="mt-6 p-4 border rounded-lg">
        <p className="text-sm font-medium">Selected: {selectedVariant.capacity}GB, Grade {selectedVariant.grade}, {selectedVariant.network}</p>
        <p className="text-2xl font-bold mt-2">${(selectedVariant.price / 100).toFixed(2)}</p>
      </div>
    </div>
  );
}
