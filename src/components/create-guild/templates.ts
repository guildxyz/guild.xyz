import { RoleFormType } from "types"
import getRandomInt from "utils/getRandomInt"

export const TEMPLATES: Array<RoleFormType> = [
  {
    name: "Member",
    description: "Free entry",

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
    description: "Basic anti-bot member verification",

    logic: "AND",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "CAPTCHA",
      },
    ],
  },
  {
    name: "Developer",
    description: "",
    logic: "OR",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "ALCHEMY_CONTRACT_DEPLOY_RELATIVE",
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
        type: "ALCHEMY_CONTRACT_DEPLOY_RELATIVE",
        chain: "ARBITRUM",
        data: {
          txCount: 1,
          timestamps: { minAmount: 31536000000 },
        },
      },
      {
        type: "ALCHEMY_CONTRACT_DEPLOY_RELATIVE",
        chain: "POLYGON",
        data: {
          txCount: 1,
          timestamps: { minAmount: 31536000000 },
        },
      },
    ],
  },
  {
    name: "Socialite",
    description: "",
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
    name: "Onchain Citizen",
    description: "",
    logic: "OR",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "ALCHEMY_TX_COUNT_RELATIVE",
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
        type: "ALCHEMY_TX_COUNT_RELATIVE",
        chain: "ARBITRUM",
        data: {
          txCount: 3,
          timestamps: { minAmount: 31536000000 },
        },
      },
      {
        type: "ALCHEMY_TX_COUNT_RELATIVE",
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
    logic: "AND",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "DISCORD_MEMBER_SINCE",
        data: {
          memberSince: 259200000,
          serverName: "xyz",
        },
      },
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
    logic: "ANY_OF",
    anyOfNum: 3,
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "EMAIL_VERIFIED",
      },
      {
        type: "GITCOIN_SCORE",
        data: { id: "1351", score: 100 },
      },
      { type: "POLYGON_ID_BASIC" },
    ],
  },
]
