import PriceTierTable from '../PriceTierTable';

export default function PriceTierTableExample() {
  const tiers = [
    { minQty: 1, maxQty: 4, pricePerUnit: 64900 },
    { minQty: 5, maxQty: 19, pricePerUnit: 62900 },
    { minQty: 20, pricePerUnit: 60900 },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 max-w-md">
      <PriceTierTable tiers={tiers} currentQty={7} />
    </div>
  );
}
