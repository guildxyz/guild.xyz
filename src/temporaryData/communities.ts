import type { Community } from "./types"

const communities: Community[] = [
  {
    id: 0,
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
      ropsten: {
        token: {
          address: "0xaD6D458402F60fD3Bd25163575031ACDce07538D",
          name: "DAI",
          symbol: "DAI",
          decimals: 18,
        },
        stakeToken: {
          address: "0xCE34c5befebc4c2c7A97A28A0736d10d91A49D99",
          name: "AGTDAI",
          symbol: "AGTDAI",
          decimals: 18,
        },
        contract: {
          address: "0x363B85Ba2b042bc929E332541813252bc1cbc098",
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
  {
    id: 1,
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
      ropsten: {
        token: {
          address: "0xaD6D458402F60fD3Bd25163575031ACDce07538D",
          name: "DAI",
          symbol: "DAI",
          decimals: 18,
        },
        stakeToken: {
          address: "0xCE34c5befebc4c2c7A97A28A0736d10d91A49D99",
          name: "AGTDAI",
          symbol: "AGTDAI",
          decimals: 18,
        },
        contract: {
          address: "0x363B85Ba2b042bc929E332541813252bc1cbc098",
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
        name: "Agora members",
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
    ],
  },
]

export type { Community }
export { communities }
