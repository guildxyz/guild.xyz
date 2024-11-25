import { z } from "zod";

export const CreateGuildSchema = z.object({
  name: z
    .string()
    .min(1, "You must specify a name for your guild")
    .max(255, "Maximum name length is 255 characters"),
  urlName: z.string().max(255).optional(),
  imageUrl: z.string().max(255).optional(),
  contact: z.string().email(),
});

export type CreateGuildForm = z.infer<typeof CreateGuildSchema>;

const GuildSchema = CreateGuildSchema.extend({
  id: z.string().uuid(),
});

export type Guild = z.infer<typeof GuildSchema>;
