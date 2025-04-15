// Unused Currently APRIL 13 2025
// 
// For Polar "Create a customer portal where your customer can view orders and subscriptions"
// portal/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { api } from '@/polar';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the customer portal session
    const portalSession = await api.customerPortal.sessions.create({
      customerId: session.user.id,
    });

    // Redirect to the customer portal
    return NextResponse.redirect(portalSession.url);
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    );
  }
}