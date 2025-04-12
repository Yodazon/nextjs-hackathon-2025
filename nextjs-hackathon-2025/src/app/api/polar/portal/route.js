// For Polar "Create a customer portal where your customer can view orders and subscriptions"
// portal/route.js
import { CustomerPortal } from "@polar-sh/nextjs";

export const GET = CustomerPortal({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    getCustomerId: (req: NextRequest) => "", // Fuction to resolve a Polar Customer ID
    server: "sandbox", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
})