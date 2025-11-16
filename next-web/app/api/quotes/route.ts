import { NextResponse } from 'next/server';

interface QuoteRequest {
  brand: string;
  model: string;
  storage: string;
  condition: string;
}

// Mock device pricing database
const devicePrices: { [key: string]: number } = {
  'iPhone 15 Pro Max': 900,
  'iPhone 15': 700,
  'iPhone 14 Pro': 600,
  'iPhone 14': 500,
  'Galaxy S24 Ultra': 800,
  'Galaxy S23': 600,
  'Galaxy Z Fold 5': 750,
  'Galaxy A54': 350,
  'Pixel 8 Pro': 750,
  'Pixel 8': 600,
  'Pixel 7 Pro': 500,
  'OnePlus 12 Pro': 500,
  'OnePlus 11': 400,
  'OnePlus 10 Pro': 350,
  'Motorola Edge 50 Pro': 450,
  'Motorola Razr 50': 550,
  'Motorola Edge 50': 350,
};

const conditionMultipliers: { [key: string]: number } = {
  'Excellent': 1.0,
  'Good': 0.85,
  'Fair': 0.65,
  'Poor': 0.4,
};

export async function POST(request: Request) {
  try {
    const body: QuoteRequest = await request.json();

    // Validate input
    if (!body.brand || !body.model || !body.storage || !body.condition) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get base price
    const basePrice = devicePrices[body.model] || 500;
    
    // Apply condition multiplier
    const multiplier = conditionMultipliers[body.condition] || 0.7;
    const finalPrice = Math.round(basePrice * multiplier);

    // Generate quote ID
    const quoteId = `Q${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate expiration (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return NextResponse.json({
      success: true,
      quote: {
        id: quoteId,
        amount: finalPrice,
        device: `${body.brand} ${body.model} ${body.storage}`,
        condition: body.condition,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Quote calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate quote' },
      { status: 500 }
    );
  }
}
