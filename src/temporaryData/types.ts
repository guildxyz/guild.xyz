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

type PlatformType = "TELEGRAM" | "DISCORD"
type PlatformName = "Discord" | `Telegram-${string}`

type PlatformFromBackend = {
  name: PlatformName
  platformId: string
  type: PlatformType
  active: boolean
}

type ProvidedPlatform = {
  type: PlatformType
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
  marketcap?: number
  levels: Level[]
}

type Community = CommunityBase & {
  chainData: ChainData[]
  communityPlatforms: PlatformFromBackend[]
}

type ProvidedCommunity = CommunityBase & {
  chainData: ChainData
  communityPlatforms: ProvidedPlatform[]
}

export type {
  Community,
  Token,
  Level,
  AccessRequirement,
  ChainData,
  ProvidedCommunity,
  ProvidedPlatform,
}
