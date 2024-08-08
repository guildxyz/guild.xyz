import { GuildContact, Schemas } from "@guildxyz/types"
import { GuildTags } from "types"
import { Chain } from "wagmiConfig/chains"
import { FeatureFlag } from "./components/FeatureFlags"

export type EditGuildForm = Schemas["GuildUpdatePayload"] & {
  admins: { address: string }[]
  contacts: (Omit<GuildContact, "id" | "guildId"> & { id?: GuildContact["id"] })[]
  guildPin?: {
    chain: Chain | "FUEL"
    isActive: boolean
  }
  // Superadmin-only fields
  featureFlags?: FeatureFlag[]
  tags?: GuildTags[]
}
