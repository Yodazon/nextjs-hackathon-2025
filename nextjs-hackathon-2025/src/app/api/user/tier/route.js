import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserTier, setUserTier } from '@/lib/userTier';
import { TIERS } from '@/lib/userTier';
import { getToken } from 'next-auth/jwt';

export async function GET(req) {
  try {
    // First try to get the session
    const session = await getServerSession(authOptions);
    
    // If no session, try to get token from Authorization header
    let userId;
    if (!session?.user?.id) {
      const token = await getToken({ req });
      if (!token?.sub) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      userId = token.sub;
    } else {
      userId = session.user.id;
    }

    const tier = await getUserTier(userId);
    return new Response(JSON.stringify({ tier }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/user/tier:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    // First try to get the session
    const session = await getServerSession(authOptions);
    
    // If no session, try to get token from Authorization header
    let userId;
    if (!session?.user?.id) {
      const token = await getToken({ req });
      if (!token?.sub) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      userId = token.sub;
    } else {
      userId = session.user.id;
    }

    const { tier } = await req.json();
    if (!Object.values(TIERS).includes(tier)) {
      return new Response(JSON.stringify({ error: 'Invalid tier' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await setUserTier(userId, tier);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST /api/user/tier:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 