import { PlatformName } from "@guildxyz/types"
import { categories, solutions } from "solutions"
import { OneOf } from "types"

export type SolutionName = keyof typeof solutions

type HandlerTypeAndParam = OneOf<
  {
    handlerType: "reward"
    handlerParam: Exclude<PlatformName, "GUILD_PIN" | "WORLD_ID">
  },
  {
    handlerType: "solution"
    handlerParam: SolutionName
  }
>
export type SolutionCardData = {
  title: string
  description: string
  imageUrl: string
  bgImageUrl: string
} & HandlerTypeAndParam

export type CategoryValue = (typeof categories)[number]["value"]
