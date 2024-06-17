import twitterRewards from "platforms/Twitter"
import emailRewards from "platforms/Email"
import telegramRewards from "platforms/Telegram"
import tokenRewards from "platforms/Token"
import gatherTownRewards from "platforms/GatherTown"
import formRewards from "platforms/Form"
import pointsRewards from "platforms/Points"
import polygonIdRewards from "platforms/PolygonID"
import uniqueTextRewards from "platforms/UniqueText"
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
} as const satisfies Rewards

export default rewards
