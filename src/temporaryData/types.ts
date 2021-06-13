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

interface Community {
  id: number
  urlName: string
  name: string
  description: string
  imageUrl: string
  theme: {
    color: string
  }
  ownerId: number
  chainData: {
    ropsten: {
      token: Token
      contract: {
        address: string
      }
    }
  }
  platforms: Platforms
  levels: Level[]
}

export type { Community, Token, Level, Platforms, AccessRequirements }
