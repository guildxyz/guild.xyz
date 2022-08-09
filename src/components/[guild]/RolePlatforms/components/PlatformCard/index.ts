import { PropsWithChildren } from "react"
import { GuildPlatform } from "types"

type PlatformCardProps = PropsWithChildren<{
  guildPlatform: GuildPlatform
  cornerButton: JSX.Element
  actionRow?: JSX.Element
}>

export { default } from "./PlatformCard"
export type { PlatformCardProps }
