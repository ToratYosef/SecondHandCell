export type DevicePricingMatrix = Record<string, Record<string, Record<string, number>>>;

export interface DeviceModel {
  name: string;
  slug: string;
  storageOptions: string[];
  carriers: string[];
  basePrice: number;
  heroImage?: string;
  pricingMatrix?: DevicePricingMatrix;
}

export interface DeviceFamily {
  brand: string;
  displayName: string;
  models: DeviceModel[];
}

export const deviceCatalog: DeviceFamily[] = [
  {
    brand: 'apple',
    displayName: 'Apple',
    models: [
      {
        name: 'iPhone 16',
        slug: 'iphone-16',
        storageOptions: ['128GB', '256GB', '512GB'],
        carriers: ['AT&T', 'T-Mobile', 'Verizon', 'Unlocked', 'Other'],
        basePrice: 720,
        heroImage: '/images/devices/iphone-16.png',
        pricingMatrix: {
          '128GB': {
            unlocked: {
              flawless: 720,
              good: 650,
              fair: 560,
              damaged: 420,
              broken: 260
            }
          }
        }
      },
      {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        storageOptions: ['128GB', '256GB', '512GB', '1TB'],
        carriers: ['AT&T', 'T-Mobile', 'Verizon', 'Unlocked', 'Other'],
        basePrice: 640,
        heroImage: '/images/devices/iphone-15-pro.png',
        pricingMatrix: {
          '256GB': {
            unlocked: {
              flawless: 640,
              good: 580,
              fair: 490,
              damaged: 360,
              broken: 210
            }
          }
        }
      }
    ]
  },
  {
    brand: 'samsung',
    displayName: 'Samsung',
    models: [
      {
        name: 'Galaxy S24 Ultra',
        slug: 'galaxy-s24-ultra',
        storageOptions: ['256GB', '512GB', '1TB'],
        carriers: ['AT&T', 'T-Mobile', 'Verizon', 'Unlocked', 'Other'],
        basePrice: 690,
        heroImage: '/images/devices/galaxy-s24-ultra.png',
        pricingMatrix: {
          '256GB': {
            unlocked: {
              flawless: 690,
              good: 620,
              fair: 520,
              damaged: 380,
              broken: 240
            }
          }
        }
      },
      {
        name: 'Galaxy Z Fold5',
        slug: 'galaxy-z-fold5',
        storageOptions: ['256GB', '512GB'],
        carriers: ['AT&T', 'T-Mobile', 'Verizon', 'Unlocked', 'Other'],
        basePrice: 800,
        heroImage: '/images/devices/galaxy-z-fold5.png',
        pricingMatrix: {
          '256GB': {
            unlocked: {
              flawless: 800,
              good: 720,
              fair: 610,
              damaged: 460,
              broken: 300
            }
          }
        }
      }
    ]
  },
  {
    brand: 'google',
    displayName: 'Google',
    models: [
      {
        name: 'Pixel 9 Pro',
        slug: 'pixel-9-pro',
        storageOptions: ['128GB', '256GB'],
        carriers: ['Google Fi', 'AT&T', 'T-Mobile', 'Unlocked', 'Other'],
        basePrice: 580,
        heroImage: '/images/devices/pixel-9-pro.png',
        pricingMatrix: {
          '256GB': {
            unlocked: {
              flawless: 580,
              good: 520,
              fair: 430,
              damaged: 320,
              broken: 180
            }
          }
        }
      }
    ]
  }
];

export function findDeviceBySlug(slug: string) {
  for (const family of deviceCatalog) {
    const model = family.models.find((entry) => entry.slug === slug);
    if (model) {
      return { brand: family.displayName, brandKey: family.brand, model };
    }
  }
  return null;
}

export function deriveBasePriceFromMatrix(matrix?: DevicePricingMatrix): number | null {
  if (!matrix) {
    return null;
  }
  let maxPrice: number | null = null;
  for (const storage of Object.values(matrix)) {
    for (const carrier of Object.values(storage)) {
      for (const price of Object.values(carrier)) {
        if (typeof price === 'number') {
          maxPrice = maxPrice === null ? price : Math.max(maxPrice, price);
        }
      }
    }
  }
  return maxPrice;
}
