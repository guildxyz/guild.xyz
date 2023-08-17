import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import useSetRoleImageAndNameFromPlatformData from "components/[guild]/AddRewardButton/hooks/useSetRoleImageAndNameFromPlatformData"
import { useWatch } from "react-hook-form"
import PlatformPreview from "./PlatformPreview"

const TelegramPreview = (): JSX.Element => {
  const groupId = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildId",
  })
  const { data, isValidating } = useIsTGBotIn(groupId)

  useSetRoleImageAndNameFromPlatformData(data?.groupIcon, data?.groupName)

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
