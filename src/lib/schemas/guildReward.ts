import { z } from "zod";
import { DateLike } from "./common";

const GUILD_REWARD_TYPES = [
  "GUILD",
  "DISCORD",
  "TELEGRAM",
  "POINTS",
  "FORM",
] as const;
export const GuildRewardTypeSchema = z.enum(GUILD_REWARD_TYPES);
export type GuildRewardType = z.infer<typeof GuildRewardTypeSchema>;

const NameAndImageSchema = z.object({
  name: z.string().optional(),
  imageUrl: z.literal("").or(z.string().url()).optional(),
});

const GuildPermissionRewardSchema = z.object({
  type: z.literal(GuildRewardTypeSchema.enum.GUILD),
  data: NameAndImageSchema.extend({
    permissionId: z.string().uuid(),
    permissionLevel: z.enum(["read", "write", "delete"]),
    permissionEntity: z.string(), // TODO: should this be an enum instead?
  }),
});

const DiscordRewardSchema = z.object({
  type: z.literal(GuildRewardTypeSchema.enum.DISCORD),
  data: NameAndImageSchema.extend({
    inviteChannel: z.string().optional(),
    invite: z.string().optional(), // Custom invite link, can be modified on our frontend
    joinButton: z.boolean().optional(),
    needCaptcha: z.boolean().optional(),

    requiredIdentityPlatform: z.literal("DISCORD"), // TODO: extract this to another schema?
  }),
});

const TelegramRewardSchema = z.object({
  type: z.literal(GuildRewardTypeSchema.enum.TELEGRAM),
  data: NameAndImageSchema.extend({
    groupId: z.string(),
  }),
});

const PointsRewardSchema = z.object({
  type: z.literal(GuildRewardTypeSchema.enum.POINTS),
  data: NameAndImageSchema.extend({
    pointId: z.string().uuid(),
  }),
});

const FormRewardSchema = z.object({
  type: z.literal(GuildRewardTypeSchema.enum.FORM),
  data: NameAndImageSchema.extend({
    formId: z.string().uuid(),
  }),
});

const CreateGuildRewardSchema = z
  .object({
    guildId: z.string().uuid(),
  })
  .and(
    z.discriminatedUnion("type", [
      GuildPermissionRewardSchema,
      DiscordRewardSchema,
      TelegramRewardSchema,
      PointsRewardSchema,
      FormRewardSchema,
    ]),
  );

const GuildRewardSchema = CreateGuildRewardSchema.and(
  z.object({
    id: z.string().uuid(),
    createdAt: DateLike,
    updatedAt: DateLike,
  }),
);

export type GuildReward = z.infer<typeof GuildRewardSchema>;
