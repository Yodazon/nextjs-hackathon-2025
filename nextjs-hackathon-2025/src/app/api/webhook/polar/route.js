import { NextResponse } from 'next/server';
import { setUserTier } from '@/lib/userTier';
import { api } from '@/polar';

export async function POST(request) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-polar-signature');

    // Verify the webhook signature
    const isValid = await api.webhooks.verify({
      signature,
      payload: body,
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { event, data } = body;

    switch (event) {
      case 'subscription.created':
      case 'subscription.updated':
      case 'checkout.session.completed':
        // Get the subscription details
        const subscription = await api.customer.subscriptions.get({
          customerSession: data.customer_session,
        }, {
          id: data.subscription_id,
        });

        // Update the user's tier based on the product
        const productId = subscription.product_id;
        let tier;
        
        if (productId === process.env.NEXT_PUBLIC_POLAR_LEARNER_PRODUCT_ID) {
          tier = 'LEARNER';
        } else if (productId === process.env.NEXT_PUBLIC_POLAR_BOOSTED_PRODUCT_ID) {
          tier = 'BOOSTED_LEARNER';
        } else {
          tier = 'FREE';
        }

        // Update the user's tier in our database
        await setUserTier(data.customer_id, tier);
        break;

      case 'subscription.cancelled':
        await setUserTier(data.customer_id, 'FREE');
        break;

      default:
        console.log(`Unhandled event type: ${event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Polar webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 