import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import { CardPropsHook } from "rewards/types"
import { GuildPlatformWithOptionalId } from "types"
import { telegramData } from "./data"

const useTelegramCardProps: CardPropsHook = (
  guildPlatform: GuildPlatformWithOptionalId
) => {
  const { data } = useIsTGBotIn(guildPlatform.platformGuildId)

  return {
    type: "TELEGRAM",
    name: data?.groupName || telegramData.name,
    image: data?.groupIcon || telegramData.imageUrl,
  }
}

export default useTelegramCardProps
