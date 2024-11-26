import { z } from "zod";
import { DateLike, ImageUrlSchema, NameSchema } from "./common";

const CreateRoleGroupSchema = z.object({
  name: NameSchema.min(1, "You must specify a name for the role group"),
  description: z.string().optional().nullable(),
  imageUrl: ImageUrlSchema.optional().nullable(),
});

export type CreateRoleGroupForm = z.infer<typeof CreateRoleGroupSchema>;

const RoleGroupSchema = CreateRoleGroupSchema.extend({
  id: z.string().uuid(),
  createdAt: DateLike,
  updatedAt: DateLike,
});

export type RoleGroup = z.infer<typeof RoleGroupSchema>;
