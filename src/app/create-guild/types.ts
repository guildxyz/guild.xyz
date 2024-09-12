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
  "name" | "urlName" | "imageUrl" | "contacts" | "roles" | "theme"
> & {
  templateId: number
}

export type GuildTemplate = Omit<Guild, "name" | "urlName"> & {
  id: number
  name?: string
  urlName?: string
  roles: (Role & { rolePlatforms: RoleReward[]; requirements: Requirement[] })[]
  guildPlatforms: GuildReward[]
}

export type CreateGuildStep = "GENERAL_DETAILS" | "CHOOSE_TEMPLATE"
