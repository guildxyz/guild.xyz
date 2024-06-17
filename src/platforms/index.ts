import twitterRewards from "platforms/Twitter"
import emailRewards from "platforms/Email"
import telegramRewards from "platforms/Telegram"
import tokenRewards from "platforms/Token"
import gatherTownRewards from "platforms/GatherTown"
import formRewards from "platforms/Form"
import pointsRewards from "platforms/Points"
import polygonIdRewards from "platforms/PolygonID"
import uniqueTextRewards from "platforms/UniqueText"
import textRewards from "platforms/Text"
import contractCallRewards from "platforms/ContractCall"
import googleRewards from "platforms/Google"
import discordRewards from "platforms/Discord"
import githubRewards from "platforms/Github"
import poapRewards from "platforms/Poap"
import { Rewards } from "./types"

const rewards = {
  ...twitterRewards,
  ...emailRewards,
  ...telegramRewards,
  ...tokenRewards,
  ...gatherTownRewards,
  ...formRewards,
  ...pointsRewards,
  ...polygonIdRewards,
  ...uniqueTextRewards,
  ...textRewards,
  ...contractCallRewards,
  ...googleRewards,
  ...discordRewards,
  ...githubRewards,
  ...poapRewards,
} as const satisfies Rewards

export default rewards
