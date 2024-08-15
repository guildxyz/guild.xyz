import bustInSilhouette from "@public/apple_emojis/bust-in-silhouette.png"
import compass from "@public/apple_emojis/compass.png"
import peopleWithBunnyEars from "@public/apple_emojis/people-with-bunny-ears.png"
import sparkles from "@public/apple_emojis/sparkles.png"
import speechBalloon from "@public/apple_emojis/speech-balloon.png"
import star from "@public/apple_emojis/star.png"
import technologist from "@public/apple_emojis/technologist.png"
import unlocked from "@public/apple_emojis/unlocked.png"
import { StaticImageData } from "next/image"

export const SUBSCRIPTIONS = [
  {
    title: "Single Pass",
    pricing: "$6 / month",
    pricingShort: "$6 / month",
    description: "For the curious, who want to try Guild’s new features",
  },
  {
    title: "Bundle Pass",
    pricing: "$60 / year",
    pricingShort: "$60 / year",
    description: "For the professionals, who would benefit from Guild continuously",
  },
  {
    title: "Lifetime Pass",
    pricing: "0.1 ETH one time",
    pricingShort: "0.1 ETH",
    description:
      "For Guild’s biggest supporters, who are excited for the future of Guild",
  },
] as const satisfies {
  title: string
  pricing: string
  description: string
  pricingShort: string
}[]

export const BENEFITS = [
  {
    title: "Launch your Guild Profile",
    description: "Your onchain profile with achievements and XP level ",
    isAvailable: true,
    image: star,
  },
  {
    title: "Unlock exclusive rewards",
    description: "Pass holders can access unique and one-off rewards from guilds",
    isAvailable: true,
    image: bustInSilhouette,
  },
  {
    title: "Get early access to Guild features",
    description: "Be the first to unlock and experience our newest features",
    isAvailable: true,
    image: unlocked,
  },
  {
    title: "Priority support",
    description:
      "Get help within hours — even our CEO is answering priority tickets",
    isAvailable: true,
    image: speechBalloon,
  },
  {
    title: "Manage your personal Guild",
    description:
      "Special access to gamified features to help creators engage their audience",
    isAvailable: false,
    image: technologist,
  },
  {
    title: "Alpha Explorer",
    description:
      "Unlock secret guilds and earn exclusive rewards before they become popular",
    isAvailable: false,
    image: compass,
  },
  {
    title: "Be part of Gold community",
    description:
      "Shape Guild's future — your ideas drive what we build and when we build it",
    isAvailable: false,
    image: peopleWithBunnyEars,
  },
  {
    title: "Very top secret stuff",
    description:
      "There are things we can't tell you just yet — you'll have to see them for yourself",
    isAvailable: false,
    image: sparkles,
  },
] as const satisfies {
  title: string
  description: string
  isAvailable: boolean
  image: StaticImageData
}[]

export const REFERRER_USER_SEARCH_PARAM_KEY = "referrer-username"
