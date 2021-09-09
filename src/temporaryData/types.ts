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

type RequirementType = "TOKEN_HOLD" | "NFT_HOLD" | "POAP"

type Requirement = {
  type: RequirementType
  address?: string
  method?: string
  value: string | number
  specData?: string
}

type Level = {
  id: number
  requirements: Requirement[]
  telegramGroupId?: string
  discordRole?: string
}

type Guild = {
  id: number
  name: string
  urlName: string
  levels: Level[]
  members: number
}

enum RequirementTypeColors {
  NFT_HOLD = "#4ade80",
  POAP = "#60a5fa",
  TOKEN_HOLD = "#818CF8",
}

export type { CoingeckoToken, NFT, Guild, Requirement, RequirementType }
export { RequirementTypeColors }
