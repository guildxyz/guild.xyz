import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_API: z.string(),
    NEXT_PUBLIC_URL: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
    NEXT_PUBLIC_URL:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_URL
        : "http://localhost",
  },
});
