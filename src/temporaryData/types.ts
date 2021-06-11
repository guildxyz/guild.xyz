type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
}

type Level = {
  name: string
  desc: string
  imageUrl: string
  accessRequirement: {
    type: "open" | "hold" | "stake"
    amount: number
    timelockMs: number
  }
  membersCount: number
  platforms: {
    telegramGroups: [
      {
        id: number
      }
    ]
    discordChannels: [
      {
        id: number
      }
    ]
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
  platforms: {
    telegram: {
      botId: number
    }
    discord: {
      serverId: number
    }
  }
  levels: Level[]
}

export type { Community, Token, Level }
