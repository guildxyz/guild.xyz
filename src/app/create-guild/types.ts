import { Guild, GuildReward, Role, RoleReward, Schemas } from "@guildxyz/types"

export type CreateGuildFormType = Pick<
  Schemas["GuildCreationPayload"],
  "name" | "urlName" | "imageUrl" | "contacts" | "roles" | "theme"
>

export type GuildTemplate = Omit<Guild, "name" | "urlName"> & {
  name?: string
  urlName?: string
  roles: (Role & { rolePlatforms: RoleReward[] })[]
  guildPlatforms: GuildReward[]
}

export type CreateGuildStep = "GENERAL_DETAILS" | "CHOOSE_TEMPLATE"
