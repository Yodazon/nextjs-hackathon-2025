// For Polar checkout
// checkout/route.js
import { Checkout } from "@polar-sh/nextjs";
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    console.log(productId);

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Ensure the product ID is in the correct format
    const formattedProductId = productId.startsWith('polar_cl_') 
      ? productId 
      : `polar_cl_${productId}`;

    console.log("formattedProductId");
    console.log(formattedProductId);

    const checkoutUrl = await Checkout({
      accessToken: process.env.POLAR_ACCESS_TOKEN,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`,
      productId: formattedProductId,
      embedOrigin: process.env.NEXT_PUBLIC_APP_URL
    });
   
    if (!checkoutUrl) {
      throw new Error('Failed to generate checkout URL');
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 