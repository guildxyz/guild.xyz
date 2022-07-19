import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import { PropsWithChildren } from "react"
import { Platform } from "types"
import PlatformCard from "../PlatformCard"

type Props = {
  guildPlatform: Platform
  onRemove?: () => void
}

const TelegramCard = ({
  guildPlatform,
  onRemove,
  children,
}: PropsWithChildren<Props>) => {
  const {
    data: { groupIcon, groupName },
  } = useIsTGBotIn(guildPlatform.platformGuildId)

  return (
    <PlatformCard
      type="TELEGRAM"
      onRemove={onRemove}
      imageUrl={groupIcon || "/default_telegram_icon.png"}
      name={groupName || ""}
    >
      {children}
    </PlatformCard>
  )
}

export default TelegramCard
