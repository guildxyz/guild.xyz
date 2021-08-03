import type { Community } from "./types"

const communities: Community[] = [
  {
    id: 1,
    name: "Agora Space",
    owner: {
      id: 1,
      address: "0x6a228b19ccebf4f0ce76c916ad3cd386f556f95e",
      telegramId: "2628282098",
      discordId: "246757911144693762",
    },
    urlName: "agora",
    description:
      "Two-way social media integration to the blockchain. Join the classes of the OG Agora space community",
    imageUrl: "temporaryCommunityLogos/agora.png",
    themeColor: "#4F46E5",
    capacity: 1000,
    chainData: [
      {
        name: "Polygon",
        contractAddress: "0x6bd3c2931eab7b15fba5c8a956171309949e4d4c",
        token: {
          name: "AGOTEST",
          symbol: "AGOTEST",
          decimals: 18,
          address: "0xff9baac24c68d810af1f98012d3d25b0ea83902e",
        },
        stakeToken: {
          name: "AGT",
          symbol: "AGT",
          decimals: 18,
          address: "0x0e4e6daab4532f6d71ffa3a8a3a5e014f60c524b",
        },
      },
    ],
    levels: [
      {
        name: "Commoners",
        description: "",
        imageUrl: "temporaryCommunityLogos/agora1.png",
        membersCount: 0,
        requirementType: "OPEN",
        requirementAmount: 0,
        stakeTimelockMs: null,
        discordRole: "0",
        telegramGroupId: "-1001173782530",
      },
      {
        name: "Citizens",
        description: "Description",
        imageUrl: "temporaryCommunityLogos/agora2.png",
        membersCount: 0,
        requirementType: "HOLD",
        requirementAmount: 10,
        stakeTimelockMs: null,
        discordRole: "868170608536596530",
        telegramGroupId: "-1001577104080",
      },
      {
        name: "Aristocracy",
        description: "Basic group for the basic HODLers",
        imageUrl: "temporaryCommunityLogos/agora3.png",
        membersCount: 0,
        requirementType: "HOLD",
        requirementAmount: 100,
        stakeTimelockMs: null,
        discordRole: "868170667172958239",
        telegramGroupId: "-1001550982354",
      },
      {
        name: "Syndicate",
        description: "Group for founders who tokenized their communities",
        imageUrl: "temporaryCommunityLogos/agora4.png",
        membersCount: 0,
        requirementType: "STAKE",
        requirementAmount: 500,
        stakeTimelockMs: 600000,
        discordRole: "868170723393413161",
        telegramGroupId: "-1001552642571",
      },
    ],
    communityPlatforms: [
      { name: "DISCORD", platformId: "842030939332804679", active: true },
      { name: "TELEGRAM", platformId: null, active: true },
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
