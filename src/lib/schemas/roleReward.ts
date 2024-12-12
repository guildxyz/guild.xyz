import { z } from "zod";
import { DateLike } from "./common";

const CapacityTimeSchema = z.object({
  capacity: z.number().nonnegative().nullish(),
  startTime: z.string().datetime().nullish(),
  endTime: z.string().datetime().nullish(),
});

export const DiscordRoleRewardDataSchema = z
  .object({
    roleId: z.string(),
  })
  .strict();

export const PointsRoleRewardDataSchema = z
  .object({
    amount: z.number().positive(),
  })
  .strict();

// TODO: we might move the `CapacityTimeSchema` inside `data` if it'll be allowed for specific reward types only
const CreateRoleRewardSchema = CapacityTimeSchema.extend({
  rewardId: z.string().uuid(),
  data: z.union([DiscordRoleRewardDataSchema, PointsRoleRewardDataSchema]),
});

export const RoleRewardSchema = CreateRoleRewardSchema.extend({
  id: z.string().uuid(),
  createdAt: DateLike,
  updatedAt: DateLike,
});

export type RoleReward = z.infer<typeof RoleRewardSchema>;
