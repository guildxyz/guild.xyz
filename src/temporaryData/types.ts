type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
}

type AccessRequirements = {
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
  accessRequirement: AccessRequirements
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
  contract: {
    address: string
  }
}

type CommunityBase = {
  id: number
  urlName: string
  name: string
  description: string
  imageUrl: string
  theme: {
    color: string
  }
  ownerId: number
  platforms: Platforms
  levels: Level[]
}

type Community = CommunityBase & {
  chainData: {
    ropsten: ChainData
  }
}

type ProvidedCommunity = CommunityBase & {
  chainData: ChainData
}

export type {
  Community,
  Token,
  Level,
  Platforms,
  AccessRequirements,
  ChainData,
  ProvidedCommunity,
}
