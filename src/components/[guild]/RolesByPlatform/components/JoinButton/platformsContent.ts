import { DiscordLogo, IconProps, TelegramLogo } from "phosphor-react"
import { PlatformName } from "types"

type Icon = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>

type PlatformData = {
  logo?: Icon
  title: string
  join: {
    description: string
  }
  leave?: {
    membershipDescription: string
    leaveDescription: string
  }
}

type Platforms = {
  [_ in PlatformName]: PlatformData
}

const platformsContent: Platforms = {
  "": {
    title: "Guild",
    join: {
      description: "Before joining a Guild, you have to sign a message.",
    },
  },
  TELEGRAM: {
    logo: TelegramLogo,
    title: "Telegram",
    join: {
      description:
        "The guild's Telegram groups are managed by the Guildxyz bot. It’ll send you invite links to every group you have access to, but first you have to sign a message with your wallet.",
    },
    leave: {
      membershipDescription:
        "You’re member of the community’s Telegram. If you gain access to or lose access from some levels, Guildxyz bot will notify you and send you the relevant invite links / remove you from the groups.",
      leaveDescription:
        "If you leave, you’ll be removed from every chat of the community. You’ll be able to join back anytime as long as you have access to at least one level.",
    },
  },
  DISCORD: {
    logo: DiscordLogo,
    title: "Discord server",
    join: {
      description:
        "Once you’re in, Guild.xyz bot will manage your role so you always have access to the channels corresponding to your current level. In order to create this connection, you have to authenticate your Discord account and sign a message with your wallet.",
    },
    leave: {
      membershipDescription:
        "You’re member of the community’s Discord server. If you gain access to or lose access from some levels, the Guild.xyz bot will update your role correspondingly. ",
      leaveDescription:
        "If you leave, you’ll be able to join back anytime as long as you have access to at least one level.",
    },
  },
}

export default platformsContent
export type { PlatformName, PlatformData }
