import { PlatformName } from "@guildxyz/types"
import { solutions } from "solutions"

export type SolutionName = keyof typeof solutions

export type SolutionCardData = {
  title: string
  description: string
  imageUrl: string
  bgImageUrl: string
  handlerType: "reward" | "solution"
  handlerParam: PlatformName | SolutionName
}
