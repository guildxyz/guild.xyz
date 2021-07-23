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
  desc: string
  imageUrl: string
  requirementType: string
  requirementAmount: number
  requirementTimelockMs: number
  membersCount: number
  platforms: {
    telegramGroups: [] | TelegramGroup[]
    discordChannels: [] | DiscordChannel[]
  }
}

type Platforms = {
  telegram: {
    active: boolean
  }
  discord: {
    active: boolean
    serverId: number
  }
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
  platforms: Platforms
  levels: Level[]
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
  Platforms,
  AccessRequirement,
  ChainData,
  ProvidedCommunity,
}
