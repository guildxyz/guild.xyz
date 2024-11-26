import { z } from "zod";
import { DateLike, ImageUrlSchema, LogicSchema, NameSchema } from "./common";

export const CreateRoleSchema = z.object({
  name: NameSchema.min(1, "You must specify a name for the role"),
  description: z.string().nullish(),
  imageUrl: ImageUrlSchema.nullish(),
  settings: z
    .object({
      logic: LogicSchema,
      position: z.number().positive().nullish(),
      anyOfNum: z.number().positive().optional(),
    })
    .default({
      logic: "AND",
      anyOfNum: 1,
    }),
  groupId: z.string().uuid(),
});

export type CreateRoleForm = z.infer<typeof CreateRoleSchema>;

const RoleSchema = CreateRoleSchema.extend({
  id: z.string().uuid(),
  createdAt: DateLike,
  updatedAt: DateLike,
  memberCount: z.number().nonnegative(),
});

export type Role = z.infer<typeof RoleSchema>;
