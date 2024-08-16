import { Schemas } from "@guildxyz/types"

export type CreateGuildFormType = Pick<
  Schemas["GuildCreationPayload"],
  "name" | "urlName" | "imageUrl" | "contacts" | "roles" | "theme"
>
