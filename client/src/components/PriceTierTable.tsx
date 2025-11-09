import GlassCard from "./GlassCard";
import { Check } from "lucide-react";

interface PriceTier {
  minQty: number;
  maxQty?: number;
  pricePerUnit: number;
}

interface PriceTierTableProps {
  tiers: PriceTier[];
  currentQty?: number;
}

export default function PriceTierTable({ tiers, currentQty = 1 }: PriceTierTableProps) {
  const getCurrentTier = () => {
    return tiers.findIndex(tier => {
      if (tier.maxQty) {
        return currentQty >= tier.minQty && currentQty <= tier.maxQty;
      }
      return currentQty >= tier.minQty;
    });
  };

  const currentTierIndex = getCurrentTier();

  return (
    <GlassCard variant="secondary">
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-4 text-white dark:text-white">Bulk Pricing</h3>
        <div className="space-y-2">
          {tiers.map((tier, index) => {
            const isActive = index === currentTierIndex;
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isActive ? 'bg-primary/20 border border-primary/30' : 'bg-white/5'
                }`}
                data-testid={`tier-${tier.minQty}`}
              >
                <div className="flex items-center gap-3">
                  {isActive && <Check className="h-4 w-4 text-primary" />}
                  <div>
                    <p className="text-sm font-medium text-white dark:text-white">
                      {tier.maxQty ? `${tier.minQty}-${tier.maxQty}` : `${tier.minQty}+`} units
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold text-white dark:text-white tabular-nums">
                  ${(tier.pricePerUnit / 100).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-white/60 dark:text-white/60 mt-4">
          Price per unit. Minimum order: 1 unit
        </p>
      </div>
    </GlassCard>
  );
}
