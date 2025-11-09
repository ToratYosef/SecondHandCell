export interface DeviceModel {
  name: string;
  slug: string;
  storageOptions: string[];
  carriers: string[];
  basePrice: number;
  heroImage?: string;
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
        heroImage: '/images/devices/iphone-16.png'
      },
      {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        storageOptions: ['128GB', '256GB', '512GB', '1TB'],
        carriers: ['AT&T', 'T-Mobile', 'Verizon', 'Unlocked', 'Other'],
        basePrice: 640,
        heroImage: '/images/devices/iphone-15-pro.png'
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
        heroImage: '/images/devices/galaxy-s24-ultra.png'
      },
      {
        name: 'Galaxy Z Fold5',
        slug: 'galaxy-z-fold5',
        storageOptions: ['256GB', '512GB'],
        carriers: ['AT&T', 'T-Mobile', 'Verizon', 'Unlocked', 'Other'],
        basePrice: 800,
        heroImage: '/images/devices/galaxy-z-fold5.png'
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
        heroImage: '/images/devices/pixel-9-pro.png'
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
