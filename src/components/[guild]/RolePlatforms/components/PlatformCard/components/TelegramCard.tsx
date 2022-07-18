import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import { PropsWithChildren } from "react"
import { useRolePlatform } from "../../RolePlatformProvider"
import PlatformCard from "../PlatformCard"

type Props = {
  onRemove?: () => void
}

const TelegramCard = ({ onRemove, children }: PropsWithChildren<Props>) => {
  const { guildPlatform } = useRolePlatform()
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
