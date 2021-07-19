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
      color: "#4F46E5",
    },
    ownerId: 0,
    chainData: {
      bsctest: {
        token: {
          address: "0x28d4f491053f2d13145082418b93adce0a29023f",
          name: "OWO",
          symbol: "OWO",
          decimals: 18,
        },
        stakeToken: {
          address: "0x81852469e863f2b2635feda8ed9b44d7208cce19",
          name: "AGTOWO",
          symbol: "AGTOWO",
          decimals: 18,
        },
        contract: {
          address: "0x8FE694259fcA3668895D2F9B1F263CE9596B32Ae",
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
      bsctest: {
        token: {
          address: "0x28d4f491053f2d13145082418b93adce0a29023f",
          name: "OWO",
          symbol: "OWO",
          decimals: 18,
        },
        stakeToken: {
          address: "0x81852469e863f2b2635feda8ed9b44d7208cce19",
          name: "AGTOWO",
          symbol: "AGTOWO",
          decimals: 18,
        },
        contract: {
          address: "0x8FE694259fcA3668895D2F9B1F263CE9596B32Ae",
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
