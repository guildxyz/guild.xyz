import { RoleFormType } from "types"
import getRandomInt from "utils/getRandomInt"

export const TEMPLATES: Array<RoleFormType> = [
  {
    name: "Member",
    logic: "AND",
    description: "Default role without special requirements",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "FREE",
      },
    ],
  },
  {
    name: "Verified member",
    description: "Basic anti-bot member verification",

    logic: "AND",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "COIN",
        chain: "ETHEREUM",
        address: "0x0000000000000000000000000000000000000000",
        data: {
          minAmount: 0.001,
        },
      },
      {
        type: "DISCORD_JOIN_FROM_NOW",
        data: {
          memberSince: 31536000000,
        },
      },
    ],
  },
  {
    name: "Twitter fam",
    description: "Basic anti-bot member verification",
    logic: "AND",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    requirements: [
      {
        type: "TWITTER_FOLLOW",
        data: {
          id: "{your_twitter_handle}",
        },
      },
      {
        type: "TWITTER_FOLLOWER_COUNT",
        data: {
          minAmount: 50,
        },
      },
    ],
  },
]
