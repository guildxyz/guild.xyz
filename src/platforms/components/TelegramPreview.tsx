import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import { useWatch } from "react-hook-form"
import PlatformPreview from "./PlatformPreview"

const TelegramPreview = (): JSX.Element => {
  const groupId = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildId",
  })
  const { data, isValidating } = useIsTGBotIn(groupId)

  return (
    <PlatformPreview
      type="TELEGRAM"
      isLoading={isValidating}
      name={data?.groupName}
      image={data?.groupIcon}
    />
  )
}

export default TelegramPreview
