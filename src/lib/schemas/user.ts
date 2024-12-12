import { z } from "zod";

export const authSchema = z.object({
  message: z.string(),
  token: z.string(),
  userId: z.string().uuid(),
});

export const tokenSchema = z.object({
  userId: z.string().uuid(),
  exp: z.number().positive().int(),
  iat: z.number().positive().int(),
});
