import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    PINATA_ADMIN_JWT: z.string(),
    LOGGING: z.coerce.boolean(),
  },
  client: {
    NEXT_PUBLIC_API: z.string(),
    NEXT_PUBLIC_PINATA_GATEWAY_URL: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API_V3,
    PINATA_ADMIN_JWT: process.env.PINATA_ADMIN_JWT,
    NEXT_PUBLIC_PINATA_GATEWAY_URL: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL,
    LOGGING: process.env.LOGGING,
  },
});
