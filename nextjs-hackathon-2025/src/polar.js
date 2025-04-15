// src/polar.js
import { Polar } from "@polar-sh/sdk";

// Sandbox API Key
export const api = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN_DEV,
  server: "sandbox",
  options: {
    sandbox: {
      testCards: true,
      testMode: true,
      debug: true
    }
  }
});
