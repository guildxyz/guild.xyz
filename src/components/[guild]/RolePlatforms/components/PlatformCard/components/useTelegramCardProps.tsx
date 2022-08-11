import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import { GuildPlatform, PlatformName } from "types"

const useTelegramCardProps = (guildPlatform: GuildPlatform) => {
  const {
    data: { groupIcon, groupName },
  } = useIsTGBotIn(guildPlatform.platformGuildId)

  return {
    type: "TELEGRAM" as PlatformName,
    name: (groupName as string) || "",
    image: (groupIcon as string) || "/default_telegram_icon.png",
  }
}

export default useTelegramCardProps
