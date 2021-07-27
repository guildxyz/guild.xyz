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

type TelegramGroup = {
  id: number
}
type DiscordChannel = {
  id: number
}

type Level = {
  name: string
  description: string
  imageUrl: string
  membersCount: number
  requirementType: "OPEN" | "STAKE" | "HOLD"
  requirementAmount: number
  stakeTimelockMs: number
  platforms: {
    telegramGroups: [] | TelegramGroup[]
    discordChannels: [] | DiscordChannel[]
  }
}

type PlatformName = "TELEGRAM" | "DISCORD"

type Platform = {
  name: PlatformName
  active: boolean
}

type ChainData = {
  token: Token
  stakeToken: Token
  contractAddress: string
  name: string
}

type CommunityBase = {
  id: number
  urlName: string
  name: string
  description: string
  imageUrl: string
  themeColor: string
  ownerId: number
  levels: Level[]
  communityPlatforms: Platform[]
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
