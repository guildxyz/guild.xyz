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

const IDENTITY_TYPES = ["DISCORD"] as const;
const IdentityTypeSchema = z.enum(IDENTITY_TYPES);
export type IdentityType = z.infer<typeof IdentityTypeSchema>;
