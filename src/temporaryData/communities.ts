import type { Community } from "./types"

const communities: Community[] = [
  {
    id: 1,
    urlName: "agora",
    name: "Agora Space",
    description:
      "Create tokenized, private communities on multiple platforms and blockchains.",
    imageUrl: "temporaryCommunityLogos/agora3.png",
    theme: {
      color: "#3020A6",
    },
    ownerId: 0,
    chainData: {
      polygon: {
        token: {
          address: "0xfF9bAaC24c68d810af1F98012d3D25B0Ea83902e",
          name: "OWO",
          symbol: "OWO",
          decimals: 18,
        },
        stakeToken: {
          address: "0x0e4E6DaAB4532F6d71FFA3A8a3A5E014f60C524b",
          name: "AGTOWO",
          symbol: "AGTOWO",
          decimals: 18,
        },
        contract: {
          address: "0x6bD3C2931eAB7b15fbA5c8a956171309949e4d4C",
        },
      },
    },
    platforms: {
      telegram: {
        active: true,
      },
      discord: {
        active: true,
        serverId: 0,
      },
    },
    levels: [
      {
        name: "Agora square",
        desc: "",
        imageUrl: "temporaryCommunityLogos/agora1.png",
        accessRequirement: {
          type: "open",
          amount: 0,
          timelockMs: 0,
        },
        membersCount: 0,
        platforms: {
          telegramGroups: [],
          discordChannels: [],
        },
      },
      {
        name: "Agora members",
        desc: "Basic group for the basic HODLers",
        imageUrl: "temporaryCommunityLogos/agora2.png",
        accessRequirement: {
          type: "hold",
          amount: 10,
          timelockMs: 0,
        },
        membersCount: 0,
        platforms: {
          telegramGroups: [],
          discordChannels: [],
        },
      },
      {
        name: "Agora community owners",
        desc: "Group for founders who tokenzied their communities",
        imageUrl: "temporaryCommunityLogos/agora3.png",
        accessRequirement: {
          type: "stake",
          amount: 50,
          timelockMs: 600000,
        },
        membersCount: 0,
        platforms: {
          telegramGroups: [],
          discordChannels: [],
        },
      },
    ],
  },
  /*
  {
    id: 2,
    urlName: "swipers",
    name: "Swipers",
    description:
      "Create tokenized, private communities on multiple platforms and blockchains.",
    imageUrl: "temporaryCommunityLogos/swipers.png",
    theme: {
      color: "#FF592E",
    },
    ownerId: 0,
    chainData: {
      polygon: {
        token: {
          address: "0xfF9bAaC24c68d810af1F98012d3D25B0Ea83902e",
          name: "OWO",
          symbol: "OWO",
          decimals: 18,
        },
        stakeToken: {
          address: "0x0e4E6DaAB4532F6d71FFA3A8a3A5E014f60C524b",
          name: "AGTOWO",
          symbol: "AGTOWO",
          decimals: 18,
        },
        contract: {
          address: "0x6bD3C2931eAB7b15fbA5c8a956171309949e4d4C",
        },
      },
    },
    platforms: {
      telegram: {
        active: true,
      },
      discord: {
        active: true,
        serverId: 0,
      },
    },
    levels: [
      {
        name: "Swipers square",
        desc: "",
        imageUrl: "temporaryCommunityLogos/swipers.png",
        accessRequirement: {
          type: "open",
          amount: 0,
          timelockMs: 0,
        },
        membersCount: 0,
        platforms: {
          telegramGroups: [],
          discordChannels: [],
        },
      },
      {
        name: "Swipers members",
        desc: "Basic group for the basic HODLers",
        imageUrl: "temporaryCommunityLogos/swipers.png",
        accessRequirement: {
          type: "hold",
          amount: 5,
          timelockMs: 0,
        },
        membersCount: 0,
        platforms: {
          telegramGroups: [],
          discordChannels: [],
        },
      },
      {
        name: "Swipers community owners",
        desc: "Group for founders who tokenzied their communities",
        imageUrl: "temporaryCommunityLogos/swipers.png",
        accessRequirement: {
          type: "stake",
          amount: 150,
          timelockMs: 600000,
        },
        membersCount: 0,
        platforms: {
          telegramGroups: [],
          discordChannels: [],
        },
      },
    ],
  },
  */
]

export type { Community }
export { communities }
