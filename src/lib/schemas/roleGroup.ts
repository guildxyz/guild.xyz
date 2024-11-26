import { z } from "zod";
import { DateLike, ImageUrlSchema, NameSchema } from "./common";

const CreateRoleGroupSchema = z.object({
  name: NameSchema.min(1, "You must specify a name for the role group"),
  urlName: z.string().max(255).optional(),
  description: z.string().nullish(),
  imageUrl: ImageUrlSchema.nullish(),
});

export type CreateRoleGroupForm = z.infer<typeof CreateRoleGroupSchema>;

const RoleGroupSchema = CreateRoleGroupSchema.extend({
  id: z.string().uuid(),
  urlName: z.string().max(255),
  createdAt: DateLike,
  updatedAt: DateLike,
});

export type RoleGroup = z.infer<typeof RoleGroupSchema>;
