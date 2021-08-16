import { DiscordLogo, TelegramLogo } from "phosphor-react"
import type { Icon, PlatformName } from "temporaryData/types"

type PlatformData = {
  logo: Icon
  title: string
  join: {
    description: string
  }
  leave: {
    membershipDescription: string
    leaveDescription: string
  }
}

type Platforms = {
  [_ in PlatformName]: PlatformData
}

const platformsContent: Platforms = {
  TELEGRAM: {
    logo: TelegramLogo,
    title: "Telegram",
    join: {
      description:
        "The community’s Telegram groups are managed by Agora’s Medousa bot. She’ll send you invite links to every group you have access to, but first, to generate your link to her, you have to sign a message with your wallet.",
    },
    leave: {
      membershipDescription:
        "You’re member of the community’s Telegram. If you gain access to or lose access from some levels, Agora’s Medousa bot will notify you and send you the relevant invite links / remove you from the groups.",
      leaveDescription:
        "If you leave, you’ll be removed from every chat of the community. You’ll be able to join back anytime as long as you have access to at least one level.",
    },
  },
  DISCORD: {
    logo: DiscordLogo,
    title: "Discord server",
    join: {
      description:
        "Once you’re in, Agora’s bot will manage your role so you always have access to the channels corresponding to your current level. In order to create this connection, you have to sign a message with your wallet and authenticate your Discord account.",
    },
    leave: {
      membershipDescription:
        "You’re member of the community’s Discord server. If you gain access to or lose access from some levels, the Agora bot will update your role correspondingly. ",
      leaveDescription:
        "If you leave, you’ll be able to join back anytime as long as you have access to at least one level.",
    },
  },
}

export default platformsContent
export type { PlatformName, PlatformData }
