import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    API: z.string(),
    URL: z.string(),
  },
  client: {
    NEXT_PUBLIC_API: z.string(),
    NEXT_PUBLIC_URL: z.string(),
  },
  runtimeEnv: {
    API: process.env.NEXT_PUBLIC_API,
    URL:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_URL
        : "http://127.0.0.1",
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
    NEXT_PUBLIC_URL:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_URL
        : "http://127.0.0.1",
  },
});
