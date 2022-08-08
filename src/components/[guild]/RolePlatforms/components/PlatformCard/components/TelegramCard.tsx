import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import { PropsWithChildren } from "react"
import { GuildPlatform } from "types"
import PlatformCard from "../PlatformCard"

type Props = {
  guildPlatform: GuildPlatform
  cornerButton: JSX.Element
}

const TelegramCard = ({
  guildPlatform,
  cornerButton,
  children,
}: PropsWithChildren<Props>) => {
  const {
    data: { groupIcon, groupName },
  } = useIsTGBotIn(guildPlatform.platformGuildId)

  return (
    <PlatformCard
      type="TELEGRAM"
      image={groupIcon || "/default_telegram_icon.png"}
      name={groupName || ""}
      cornerButton={cornerButton}
    >
      {children}
    </PlatformCard>
  )
}

export default TelegramCard
