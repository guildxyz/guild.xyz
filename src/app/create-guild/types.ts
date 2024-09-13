import {
  Guild,
  GuildReward,
  Requirement,
  Role,
  RoleReward,
  Schemas,
} from "@guildxyz/types"

export type CreateGuildFormType = Pick<
  Schemas["GuildCreationPayload"],
  "name" | "urlName" | "imageUrl" | "contacts" | "roles" | "theme" | "guildPlatforms"
>

export type GuildTemplate = Pick<
  Guild,
  "name" | "urlName" | "imageUrl" | "theme"
> & {
  roles: (Role & { rolePlatforms: RoleReward[]; requirements: Requirement[] })[]
  guildPlatforms: GuildReward[]
}

export type CreatableGuildTemplate = Pick<
  CreateGuildFormType,
  "roles" | "guildPlatforms" | "theme" | "name" | "imageUrl" | "urlName"
>

export type CreateGuildStep = "GENERAL_DETAILS" | "CHOOSE_TEMPLATE"
