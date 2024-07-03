import contractCallReward from "rewards/ContractCall"
import discordReward from "rewards/Discord"
import emailReward from "rewards/Email"
import farcasterReward from "rewards/Farcaster"
import formReward from "rewards/Forms"
import gatherTownReward from "rewards/Gather"
import githubReward from "rewards/Github"
import googleReward from "rewards/Google"
import poapReward from "rewards/Poap"
import pointsReward from "rewards/Points"
import polygonIdReward from "rewards/PolygonID"
import textReward from "rewards/SecretText"
import telegramReward from "rewards/Telegram"
import tokenReward from "rewards/Token"
import twitterRewardV1, { twitterReward } from "rewards/Twitter"
import uniqueTextReward from "rewards/UniqueText"
import { Rewards } from "./types"

const rewards: Rewards = {
  TWITTER_V1: twitterRewardV1,
  TWITTER: twitterReward,
  EMAIL: emailReward,
  TELEGRAM: telegramReward,
  ERC20: tokenReward,
  GATHER_TOWN: gatherTownReward,
  FORM: formReward,
  POINTS: pointsReward,
  POLYGON_ID: polygonIdReward,
  UNIQUE_TEXT: uniqueTextReward,
  TEXT: textReward,
  CONTRACT_CALL: contractCallReward,
  GOOGLE: googleReward,
  DISCORD: discordReward,
  GITHUB: githubReward,
  POAP: poapReward,
  FARCASTER: farcasterReward,
} as const

export default rewards

export * from "./types"
export * from "./constants"
export * from "./utils"
