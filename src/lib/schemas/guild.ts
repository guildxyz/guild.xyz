import { z } from "zod";

export const GuildSchema = z.object({
  name: z.string().min(1).max(255),
  urlName: z.string().max(255).optional(),
  imageUrl: z.string().max(255).optional(),
  contact: z.string().email(),
});

export type CreateGuildForm = z.infer<typeof GuildSchema>;

const GuildSchemaWithId = GuildSchema.extend({
  id: z.string().uuid(),
});

export type Guild = z.infer<typeof GuildSchemaWithId>;
