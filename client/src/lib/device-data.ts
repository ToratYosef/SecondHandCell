import { DeviceModel, DeviceCondition, Carrier, DeviceLockStatus } from "@shared/schema";

export const deviceModels: DeviceModel[] = [
  { id: "iphone-15-pro-max", brand: "iPhone", name: "iPhone 15 Pro Max", storageOptions: [256, 512, 1000], basePrice: 1100, year: 2024 },
  { id: "iphone-15-pro", brand: "iPhone", name: "iPhone 15 Pro", storageOptions: [128, 256, 512], basePrice: 950, year: 2024 },
  { id: "iphone-15-plus", brand: "iPhone", name: "iPhone 15 Plus", storageOptions: [128, 256, 512], basePrice: 800, year: 2024 },
  { id: "iphone-15", brand: "iPhone", name: "iPhone 15", storageOptions: [128, 256, 512], basePrice: 700, year: 2024 },
  { id: "iphone-14-pro-max", brand: "iPhone", name: "iPhone 14 Pro Max", storageOptions: [128, 256, 512, 1000], basePrice: 850, year: 2023 },
  { id: "iphone-14-pro", brand: "iPhone", name: "iPhone 14 Pro", storageOptions: [128, 256, 512], basePrice: 750, year: 2023 },
  { id: "iphone-14-plus", brand: "iPhone", name: "iPhone 14 Plus", storageOptions: [128, 256, 512], basePrice: 600, year: 2023 },
  { id: "iphone-14", brand: "iPhone", name: "iPhone 14", storageOptions: [128, 256, 512], basePrice: 550, year: 2023 },
  { id: "iphone-13-pro-max", brand: "iPhone", name: "iPhone 13 Pro Max", storageOptions: [128, 256, 512, 1000], basePrice: 650, year: 2022 },
  { id: "iphone-13-pro", brand: "iPhone", name: "iPhone 13 Pro", storageOptions: [128, 256, 512], basePrice: 550, year: 2022 },
  { id: "iphone-13", brand: "iPhone", name: "iPhone 13", storageOptions: [128, 256, 512], basePrice: 450, year: 2022 },
  { id: "iphone-12-pro-max", brand: "iPhone", name: "iPhone 12 Pro Max", storageOptions: [128, 256, 512], basePrice: 500, year: 2021 },
  { id: "iphone-12", brand: "iPhone", name: "iPhone 12", storageOptions: [64, 128, 256], basePrice: 350, year: 2021 },
  
  { id: "galaxy-s24-ultra", brand: "Samsung", name: "Galaxy S24 Ultra", storageOptions: [256, 512, 1000], basePrice: 950, year: 2024 },
  { id: "galaxy-s24-plus", brand: "Samsung", name: "Galaxy S24+", storageOptions: [256, 512], basePrice: 750, year: 2024 },
  { id: "galaxy-s24", brand: "Samsung", name: "Galaxy S24", storageOptions: [128, 256], basePrice: 650, year: 2024 },
  { id: "galaxy-z-fold-5", brand: "Samsung", name: "Galaxy Z Fold 5", storageOptions: [256, 512, 1000], basePrice: 1000, year: 2023 },
  { id: "galaxy-z-flip-5", brand: "Samsung", name: "Galaxy Z Flip 5", storageOptions: [256, 512], basePrice: 700, year: 2023 },
  { id: "galaxy-s23-ultra", brand: "Samsung", name: "Galaxy S23 Ultra", storageOptions: [256, 512, 1000], basePrice: 750, year: 2023 },
  { id: "galaxy-s23-plus", brand: "Samsung", name: "Galaxy S23+", storageOptions: [256, 512], basePrice: 600, year: 2023 },
  { id: "galaxy-s23", brand: "Samsung", name: "Galaxy S23", storageOptions: [128, 256], basePrice: 500, year: 2023 },
  { id: "galaxy-s22-ultra", brand: "Samsung", name: "Galaxy S22 Ultra", storageOptions: [128, 256, 512], basePrice: 550, year: 2022 },
  { id: "galaxy-s22-plus", brand: "Samsung", name: "Galaxy S22+", storageOptions: [128, 256], basePrice: 450, year: 2022 },
  { id: "galaxy-s22", brand: "Samsung", name: "Galaxy S22", storageOptions: [128, 256], basePrice: 400, year: 2022 },
];

export const conditionMultipliers: Record<DeviceCondition, number> = {
  "Excellent": 1,
  "Good": 0.85,
  "Fair": 0.65,
};

export const storageMultipliers: Record<number, number> = {
  64: 0.85,
  128: 1,
  256: 1.18,
  512: 1.38,
  1000: 1.62,
};

const lockMultipliers: Record<DeviceLockStatus, number> = {
  unlocked: 1,
  locked: 0.92,
};

export type DevicePricingMatrix = Record<
  number,
  Record<DeviceLockStatus, Record<DeviceCondition, number>>
>;

export const devicePricingDb: Record<string, DevicePricingMatrix> = Object.fromEntries(
  deviceModels.map((model) => {
    const matrix: DevicePricingMatrix = {};

    model.storageOptions.forEach((storage) => {
      const storageBase = model.basePrice * (storageMultipliers[storage] ?? 1);

      const lockEntries: Record<DeviceLockStatus, Record<DeviceCondition, number>> = {
        unlocked: {
          Excellent: Math.round(storageBase * conditionMultipliers.Excellent),
          Good: Math.round(storageBase * conditionMultipliers.Good),
          Fair: Math.round(storageBase * conditionMultipliers.Fair),
        },
        locked: {
          Excellent: Math.round(storageBase * lockMultipliers.locked * conditionMultipliers.Excellent),
          Good: Math.round(storageBase * lockMultipliers.locked * conditionMultipliers.Good),
          Fair: Math.round(storageBase * lockMultipliers.locked * conditionMultipliers.Fair),
        },
      };

      matrix[storage] = lockEntries;
    });

    return [model.id, matrix];
  }),
);

export const carrierLockStatus: Record<Carrier, DeviceLockStatus> = {
  "AT&T": "locked",
  "VZW": "locked",
  "TMO": "locked",
  "UNLOCKED": "unlocked",
};

export function calculatePrice(
  modelId: string,
  storage: number,
  condition: DeviceCondition,
  carrier: Carrier
): number {
  const pricing = devicePricingDb[modelId];
  if (!pricing) return 0;

  const storagePricing = pricing[storage];
  if (!storagePricing) return 0;

  const lockStatus = carrierLockStatus[carrier];
  const conditionPricing = storagePricing[lockStatus];

  return conditionPricing?.[condition] ?? 0;
}
