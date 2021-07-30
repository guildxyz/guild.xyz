type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
}

type AccessRequirement = {
  type: "open" | "hold" | "stake"
  amount: number
  timelockMs: number
}

type Level = {
  name: string
  description: string
  imageUrl: string
  membersCount: number
  requirementType: "OPEN" | "STAKE" | "HOLD"
  requirementAmount: number
  stakeTimelockMs: number
  telegramGroupId: string
  discordRole: string
}

type PlatformName = "TELEGRAM" | "DISCORD"

type Platform = {
  name: PlatformName
  active: boolean
  platformId: string
}

type ChainData = {
  token: Token
  stakeToken?: Token
  contractAddress?: string
  name: string
}

type CommunityBase = {
  id: number
  urlName: string
  name: string
  description: string
  imageUrl: string
  themeColor: string
  marketcap?: number
  levels: Level[]
  communityPlatforms: Platform[]
  owner?: {
    id: number
    address: string
    telegramId: string
    discordId: string
  }
  capacity: number
}

type Community = CommunityBase & {
  chainData: ChainData[]
}

type ProvidedCommunity = CommunityBase & {
  chainData: ChainData
}

export type {
  Community,
  Token,
  Level,
  AccessRequirement,
  ChainData,
  ProvidedCommunity,
  Platform,
  PlatformName,
}
