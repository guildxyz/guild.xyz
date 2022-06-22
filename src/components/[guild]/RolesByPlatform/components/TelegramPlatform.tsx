import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import { Platform as PlatformType } from "types"
import Platform from "./Platform"

const TelegramPlatform = ({ platform }: { platform: PlatformType }) => {
  const { data } = useIsTGBotIn(platform?.platformGuildId)

  return <Platform platform={platform} name={data?.groupName} />
}

export default TelegramPlatform
