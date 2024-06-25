import { RoleFormType } from "types"
import getRandomInt from "utils/getRandomInt"

export const TEMPLATES: Array<RoleFormType> = [
  {
    name: "Member",
    visibility: "PUBLIC",

    logic: "AND",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "FREE",
      },
    ],
  },
  {
    name: "Not a robot",
    visibility: "PUBLIC",

    logic: "AND",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "CAPTCHA",
        data: {},
      },
    ],
  },
  {
    name: "Socialite",
    description: "",
    visibility: "PUBLIC",
    logic: "OR",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "TWITTER_FOLLOWER_COUNT",
        data: {
          minAmount: 50,
        },
      },
      {
        type: "FARCASTER_TOTAL_FOLLOWERS",
        data: {
          min: 10,
        },
      },
      {
        type: "LENS_TOTAL_FOLLOWERS",
        data: {
          min: 10,
        },
      },
    ],
  },
  {
    name: "Developer",
    description: "",
    visibility: "PUBLIC",
    logic: "OR",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "COVALENT_CONTRACT_DEPLOY_RELATIVE",
        chain: "ETHEREUM",
        data: {
          txCount: 1,
          timestamps: { minAmount: 31536000000 },
        },
      },
      {
        type: "COVALENT_CONTRACT_DEPLOY_RELATIVE",
        chain: "BASE_MAINNET",
        data: {
          txCount: 1,
          timestamps: { minAmount: 31536000000 },
        },
      },
      {
        type: "COVALENT_CONTRACT_DEPLOY_RELATIVE",
        chain: "OPTIMISM",
        data: {
          txCount: 1,
          timestamps: { minAmount: 31536000000 },
        },
      },
      {
        type: "COVALENT_CONTRACT_DEPLOY_RELATIVE",
        chain: "ARBITRUM",
        data: {
          txCount: 1,
          timestamps: { minAmount: 31536000000 },
        },
      },
      {
        type: "COVALENT_CONTRACT_DEPLOY_RELATIVE",
        chain: "POLYGON",
        data: {
          txCount: 1,
          timestamps: { minAmount: 31536000000 },
        },
      },
    ],
  },

  {
    name: "Onchain Citizen",
    description: "",
    visibility: "PUBLIC",
    logic: "OR",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "COVALENT_TX_COUNT_RELATIVE",
        chain: "ETHEREUM",
        data: {
          txCount: 1,
          timestamps: { minAmount: 31536000000 },
        },
      },
      {
        type: "COVALENT_TX_COUNT_RELATIVE",
        chain: "BASE_MAINNET",
        data: {
          txCount: 3,
          timestamps: { minAmount: 31536000000 },
        },
      },
      {
        type: "COVALENT_TX_COUNT_RELATIVE",
        chain: "OPTIMISM",
        data: {
          txCount: 3,
          timestamps: { minAmount: 31536000000 },
        },
      },
      {
        type: "COVALENT_TX_COUNT_RELATIVE",
        chain: "ARBITRUM",
        data: {
          txCount: 3,
          timestamps: { minAmount: 31536000000 },
        },
      },
      {
        type: "COVALENT_TX_COUNT_RELATIVE",
        chain: "POLYGON",
        data: {
          txCount: 3,
          timestamps: { minAmount: 31536000000 },
        },
      },
    ],
  },
  {
    name: "Discord Fellow",
    description: "",
    visibility: "PUBLIC",
    logic: "AND",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "DISCORD_JOIN_FROM_NOW",
        data: {
          memberSince: 15724800000,
        },
      },
    ],
  },
  {
    name: "Sybil Resistant",
    description: "",
    visibility: "PUBLIC",
    logic: "ANY_OF",
    anyOfNum: 3,
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "EMAIL_VERIFIED",
      },
      {
        data: {
          schemaId:
            "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9",
          attester: "0x357458739F90461b99789350868CD7CF330Dd7EE",
        },

        type: "COINBASE_EAS_ATTESTED_BY",
        chain: "BASE_MAINNET",
      },
      {
        data: { minAmount: 100 },
        type: "GUILD_ADMIN",
        chain: "ETHEREUM",
      },
      {
        type: "GITCOIN_PASS",
        chain: "ETHEREUM",
      },
      {
        // Safe to cast, we'll delete this in a PR soon
        data: { maxAmount: 2592000000, query: "" } as any,
        type: "POLYGON_ID_BASIC",
        chain: "POLYGON",
      },
      {
        type: "FARCASTER_PROFILE",

        chain: "ETHEREUM",
      },
      {
        data: { minAmount: 3 },

        type: "SNAPSHOT_VOTES",
        chain: "ETHEREUM",
      },
      {
        data: { minAmount: 10 },
        type: "YUP",
        chain: "ETHEREUM",
      },
      {
        type: "SOUND_ARTIST",
        chain: "ETHEREUM",
      },
    ],
  },
]
