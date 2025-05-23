// For Polar checkout
// checkout/route.js
import { NextResponse } from 'next/server';
import { api } from '@/polar';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Create a checkout session
    const checkoutSession = await api.checkout.sessions.create({
      productId: productId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`,
      embedOrigin: process.env.NEXT_PUBLIC_APP_URL,
      mode: 'subscription',
      allowPromotionCodes: true,
      billingAddressCollection: 'required',
      customerEmail: null, // Will be collected during checkout
      metadata: {
        environment: 'sandbox'
      }
    });

    if (!checkoutSession?.url) {
      throw new Error('Failed to generate checkout URL');
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 