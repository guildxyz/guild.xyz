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
  token: {
    address: string
    name: string
  }
  contract: {
    address: string
  }
  platforms: {
    telegram: {
      botId: number
    }
    discord: {
      serverId: number
    }
  }
  levels: [
    {
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
  ]
}

const communities: Community[] = [
  {
    id: 0,
    urlName: "agora",
    name: "Agora Space",
    description: "something",
    imageUrl: "",
    theme: {
      color: "",
    },
    ownerId: 0,
    token: {
      address: "string",
      name: "string",
    },
    contract: {
      address: "string",
    },
    platforms: {
      telegram: {
        botId: 0,
      },
      discord: {
        serverId: 0,
      },
    },
    levels: [
      {
        name: "string",
        desc: "string",
        imageUrl: "string",
        accessRequirement: {
          type: "open",
          amount: 0,
          timelockMs: 0,
        },
        membersCount: 0,
        platforms: {
          telegramGroups: [
            {
              id: 0,
            },
          ],
          discordChannels: [
            {
              id: 0,
            },
          ],
        },
      },
    ],
  },
  {
    id: 0,
    urlName: "ethane",
    name: "Ethane",
    description: "something",
    imageUrl: "",
    theme: {
      color: "",
    },
    ownerId: 0,
    token: {
      address: "string",
      name: "string",
    },
    contract: {
      address: "string",
    },
    platforms: {
      telegram: {
        botId: 0,
      },
      discord: {
        serverId: 0,
      },
    },
    levels: [
      {
        name: "string",
        desc: "string",
        imageUrl: "string",
        accessRequirement: {
          type: "open",
          amount: 0,
          timelockMs: 0,
        },
        membersCount: 0,
        platforms: {
          telegramGroups: [
            {
              id: 0,
            },
          ],
          discordChannels: [
            {
              id: 0,
            },
          ],
        },
      },
    ],
  },
]

export type { Community }
export { communities }
