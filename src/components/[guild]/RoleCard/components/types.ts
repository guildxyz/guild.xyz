import { Transition } from "framer-motion"
import { GuildPlatform, Role, RolePlatform } from "types"

export type RewardProps = {
  role: Role // should change to just roleId when we won't need memberCount anymore
  platform: RolePlatform
  withLink?: boolean
  isLinkColorful?: boolean
}

export type RewardIconProps = {
  rolePlatformId: number
  guildPlatform: GuildPlatform
  transition?: Transition
}
