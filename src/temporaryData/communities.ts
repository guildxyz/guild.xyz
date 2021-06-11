import type { Community } from "./types"

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
    chainData: {
      ropsten: {
        token: {
          address: "0xaD6D458402F60fD3Bd25163575031ACDce07538D",
          name: "DAI",
          symbol: "DAI",
          decimals: 18,
        },
        contract: {
          address: "0x363B85Ba2b042bc929E332541813252bc1cbc098",
        },
      },
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
    id: 1,
    urlName: "ethane",
    name: "Ethane",
    description: "something",
    imageUrl: "",
    theme: {
      color: "",
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
        contract: {
          address: "0x363B85Ba2b042bc929E332541813252bc1cbc098",
        },
      },
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
