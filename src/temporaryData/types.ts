type CoingeckoToken = {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

type NFT = {
  name: string
  address: string
  logoURI: string
}

type RequirementType = "TOKEN" | "NFT" | "POAP"

type Requirement = {
  type: RequirementType
  address?: string
  method?: string
  data?: string
  value: string | number
}

type Level = {
  id: number
  requirements: Requirement[]
  telegramGroupId?: string
  discordRole?: string
}

type PlatformName = "TELEGRAM" | "DISCORD"

type Platform = {
  name: PlatformName
  active: boolean
  platformId: string
  inviteChannel?: string
}

type Guild = {
  id: number
  name: string
  urlName: string
  levels: Level[]
  members: number
  communityPlatforms: Platform[]
}

enum RequirementTypeColors {
  NFT = "#4ade80",
  POAP = "#60a5fa",
  TOKEN = "#818CF8",
}

export type {
  CoingeckoToken,
  NFT,
  PlatformName,
  Guild,
  Requirement,
  RequirementType,
}
export { RequirementTypeColors }
