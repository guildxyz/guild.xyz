import { z } from "zod";
import { DateLike, ImageUrlSchema, LogicSchema, NameSchema } from "./common";
import { RuleSchema } from "./rule";

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

  topLevelAccessGroupId: z.string().uuid(),
  accessGroups: z.array(
    z.object({
      gate: z.enum(["AND", "OR", "ANY_OF"]),
      rules: z.array(RuleSchema),
    }),
  ),
  rewards: z.array(
    z.object({
      rewardId: z.string().uuid(),
    }),
  ),
});

export type Role = z.infer<typeof RoleSchema>;
