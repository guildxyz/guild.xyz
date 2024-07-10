import contractCallComponents from "rewards/ContractCall/components"
import discordComponents from "rewards/Discord/components"
import formComponents from "rewards/Forms/components"
import gatherTownComponents from "rewards/Gather/components"
import githubComponents from "rewards/Github/components"
import googleComponents from "rewards/Google/components"
import poapComponents from "rewards/Poap/components"
import pointsComponents from "rewards/Points/components"
import polygonIdComponents from "rewards/PolygonID/components"
import textComponents from "rewards/SecretText/components"
import telegramComponents from "rewards/Telegram/components"
import tokenComponents from "rewards/Token/components"
import uniqueTextComponents from "rewards/UniqueText/components"
import { RewardComponents } from "./types"

export default {
  TELEGRAM: telegramComponents,
  ERC20: tokenComponents,
  GATHER_TOWN: gatherTownComponents,
  FORM: formComponents,
  POINTS: pointsComponents,
  POLYGON_ID: polygonIdComponents,
  UNIQUE_TEXT: uniqueTextComponents,
  TEXT: textComponents,
  CONTRACT_CALL: contractCallComponents,
  GOOGLE: googleComponents,
  DISCORD: discordComponents,
  GITHUB: githubComponents,
  POAP: poapComponents,
} as Partial<RewardComponents>
