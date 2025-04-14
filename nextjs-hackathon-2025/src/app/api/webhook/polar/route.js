import { NextResponse } from 'next/server';
import { setUserTier } from '@/lib/userTier';

export async function POST(request) {
  try {
    const signature = request.headers.get('x-polar-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const body = await request.json();
    const { event, data } = body;

    // Verify signature with Polar's public key
    // This is a placeholder - implement proper signature verification
    // const isValid = verifySignature(signature, body);
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    switch (event) {
      case 'subscription.created':
      case 'subscription.updated':
        await setUserTier(data.customer_id, data.plan_id === process.env.POLAR_LEARNER_PRODUCT_ID ? 'learner' : 'boosted_learner');
        break;
      case 'subscription.cancelled':
        await setUserTier(data.customer_id, 'free');
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Polar webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 