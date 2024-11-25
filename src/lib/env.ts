import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    PINATA_ADMIN_JWT: z.string(),
  },
  client: {
    NEXT_PUBLIC_API: z.string(),
    NEXT_PUBLIC_SIWE_URL: z.string(),
    NEXT_PUBLIC_PINATA_GATEWAY_URL: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API_V3,
    NEXT_PUBLIC_SIWE_URL:
      process.env.NODE_ENV === "production"
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "http://localhost:3000",
    PINATA_ADMIN_JWT: process.env.PINATA_ADMIN_JWT,
    NEXT_PUBLIC_PINATA_GATEWAY_URL: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL,
  },
});
