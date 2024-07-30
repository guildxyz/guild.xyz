import dynamic from "next/dynamic"
import { AddRewardPanelLoadingSpinner } from "rewards/components/AddRewardPanelLoadingSpinner"
import { SolutionCardData } from "./types"

export const solutions = {
  LIQUIDITY: dynamic(
    () => import("solutions/LiquidityIncentive/LiquidityIncentiveSetupModal"),
    {
      ssr: false,
      loading: AddRewardPanelLoadingSpinner,
    }
  ),
}

export const categories = [
  {
    label: "Memberships",
    value: "memberships",
  },
  {
    label: "NFTs",
    value: "nft",
  },
  {
    label: "Tokens",
    value: "tokens",
  },
  {
    label: "Engagement",
    value: "engagement",
  },
  {
    label: "Sybil Protection",
    value: "sybil",
  },
] as const

export const memberships: SolutionCardData[] = [
  {
    title: "Discord membership",
    description: "Exclusive Discord roles for accessing your server and channels",
    imageUrl: "/platforms/discord.png",
    bgImageUrl: "/solutions/discord-bg.jpg",
    handlerType: "reward",
    handlerParam: "DISCORD",
  },
  {
    title: "Telegram group gating",
    description: "Start your exclusive token-gated Telegram group",
    imageUrl: "/platforms/telegram.png",
    bgImageUrl: "/solutions/telegram-bg.jpg",
    handlerType: "reward",
    handlerParam: "TELEGRAM",
  },
  {
    title: "Gather Town gating",
    description:
      "Gather brings the best of in-person collaboration to distributed teams",
    imageUrl: "/platforms/gather.png",
    bgImageUrl: "/solutions/gather-bg.jpg",
    handlerType: "reward",
    handlerParam: "GATHER_TOWN",
  },
  {
    title: "Google Docs gating",
    description:
      "Provide exclusive access to Google files for users who meet specific requirements",
    imageUrl: "/platforms/google.png",
    bgImageUrl: "/solutions/google-bg.jpg",
    handlerType: "reward",
    handlerParam: "GOOGLE",
  },
  {
    title: "GitHub repository gating",
    description: "Grant access to a private codebase for qualifying contributors",
    imageUrl: "/platforms/github.png",
    bgImageUrl: "/solutions/github-bg.jpg",
    handlerType: "reward",
    handlerParam: "GITHUB",
  },
]

export const tokens: SolutionCardData[] = [
  {
    title: "Token liquidity program",
    description: "Reward users with points for providing liquidity to your token",
    imageUrl: "/solutions/liquidity.png",
    bgImageUrl: "/solutions/liquidity-bg.jpg",
    handlerType: "solution",
    handlerParam: "LIQUIDITY",
  },
]

export const nft: SolutionCardData[] = [
  {
    title: "NFT Drop",
    description:
      "Launch NFT sales or open editions with specific collection requirements",
    imageUrl: "/platforms/nft.png",
    bgImageUrl: "/solutions/nft-bg.jpg",
    handlerType: "reward",
    handlerParam: "CONTRACT_CALL",
  },
]

export const engagement: SolutionCardData[] = [
  {
    title: "POAP Distribution",
    description: "Reward your attendees with POAPs (link)",
    imageUrl: "/platforms/poap.png",
    bgImageUrl: "/solutions/poap-bg.jpg",
    handlerType: "reward",
    handlerParam: "POAP",
  },
  {
    title: "Points and Leaderboard",
    description: "Launch XP, Stars, Keys, Gems, or any other rewards you need",
    imageUrl: "/platforms/points.png",
    bgImageUrl: "/solutions/points-bg.jpg",
    handlerType: "reward",
    handlerParam: "POINTS",
  },
  {
    title: "Forms & Surveys",
    description:
      "Collect verified information, feedback, and applications, and reward your community",
    imageUrl: "/platforms/form.png",
    bgImageUrl: "/solutions/form-bg.jpg",
    handlerType: "reward",
    handlerParam: "FORM",
  },
  {
    title: "Text or link distribution",
    description: "Distribute secret messages or promotion codes",
    imageUrl: "/platforms/text.png",
    bgImageUrl: "/solutions/text-bg.jpg",
    handlerType: "reward",
    handlerParam: "TEXT",
  },
]

export const sybil: SolutionCardData[] = [
  {
    title: "PolygonID credentials",
    description: "Self-Sovereign Identity Solution with Zero-Knowledge Proofs",
    imageUrl: "/requirementLogos/polygonId.svg",
    bgImageUrl: "/solutions/polygon-bg.jpg",
    handlerType: "reward",
    handlerParam: "POLYGON_ID",
  },
]
