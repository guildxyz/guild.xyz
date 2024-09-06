import { contractCallData } from "rewards/ContractCall/data"
import { discordData } from "rewards/Discord/data"
import { emailData } from "rewards/Email/data"
import { farcasterData } from "rewards/Farcaster/data"
import { formData } from "rewards/Forms/data"
import { gatherData } from "rewards/Gather/data"
import { githubData } from "rewards/Github/data"
import { googleData } from "rewards/Google/data"
import { poapData } from "rewards/Poap/data"
import { pointsData } from "rewards/Points/data"
import { polygonIdData } from "rewards/PolygonID/data"
import { secretTextData } from "rewards/SecretText/data"
import { telegramData } from "rewards/Telegram/data"
import { tokenData } from "rewards/Token/data"
import { twitterData, twitterV1Data } from "rewards/Twitter/data"
import { uniqueTextData } from "rewards/UniqueText/data"
import { worldIDData } from "rewards/WorldID/data"
import { Rewards } from "./types"

const rewards: Rewards = {
  TWITTER_V1: twitterV1Data,
  TWITTER: twitterData,
  EMAIL: emailData,
  TELEGRAM: telegramData,
  ERC20: tokenData,
  GATHER_TOWN: gatherData,
  FORM: formData,
  POINTS: pointsData,
  POLYGON_ID: polygonIdData,
  UNIQUE_TEXT: uniqueTextData,
  TEXT: secretTextData,
  CONTRACT_CALL: contractCallData,
  GOOGLE: googleData,
  DISCORD: discordData,
  GITHUB: githubData,
  POAP: poapData,
  FARCASTER: farcasterData,
  WORLD_ID: worldIDData,
} as const

export default rewards

export * from "./constants"
export * from "./types"
export * from "./utils"
