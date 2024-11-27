import { z } from "zod";
import { DateLike, ImageUrlSchema, NameSchema } from "./common";

export const CreateGuildSchema = z.object({
  name: NameSchema.min(1, "You must specify a name for your guild"),
  urlName: z.string().max(255).optional(),
  imageUrl: ImageUrlSchema.optional(),
  description: z.string().optional(),
  contact: z.string().min(1, "You must specify a contact for your guild"),
});

export type CreateGuildForm = z.infer<typeof CreateGuildSchema>;

const GuildSchema = CreateGuildSchema.extend({
  id: z.string().uuid(),
  urlName: z.string().max(255),
  createdAt: DateLike,
  updatedAt: DateLike,
  roleCount: z.number().nonnegative(),
  memberCount: z.number().nonnegative(),
});

export type Guild = z.infer<typeof GuildSchema>;
