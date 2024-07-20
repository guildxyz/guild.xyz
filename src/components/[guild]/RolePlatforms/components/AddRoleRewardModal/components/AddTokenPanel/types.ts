import { Schemas } from "@guildxyz/types"
import { Chain } from "wagmiConfig/chains"

export enum TokenRewardType {
  DYNAMIC_SNAPSHOT = "DYNAMIC_SNAPSHOT",
  DYNAMIC_POINTS = "DYNAMIC_POINTS",
  STATIC = "STATIC",
}

export type AddTokenFormType = {
  poolId: number
  multiplier: number
  addition: number
  chain: Chain
  contractAddress: `0x${string}`
  tokenAddress: `0x${string}`
  name: string
  description: string
  imageUrl: string
  data: {
    guildPlatformId: number
  }
  snapshotId: number
  type: TokenRewardType
  staticValue?: number
  snapshotRequirement?: Extract<
    Schemas["RequirementCreationPayload"],
    { type: "GUILD_SNAPSHOT" }
  >
}
