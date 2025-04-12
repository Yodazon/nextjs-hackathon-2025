// For Polar checkout
// checkout/route.js
import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade/success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`,
}); 