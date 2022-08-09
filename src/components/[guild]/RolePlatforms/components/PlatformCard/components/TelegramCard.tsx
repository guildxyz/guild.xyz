import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import { PlatformCardProps } from ".."
import PlatformCard from "../PlatformCard"

const TelegramCard = ({
  guildPlatform,
  cornerButton,
  children,
}: PlatformCardProps) => {
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
