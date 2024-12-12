import { z } from "zod";

const IDENTITY_TYPES = ["DISCORD"] as const;
export const IdentityTypeSchema = z.enum(IDENTITY_TYPES);
export type IdentityType = z.infer<typeof IdentityTypeSchema>;

export const IDENTITY_NAME = {
  DISCORD: "Discord",
} satisfies Record<IdentityType, string>;
