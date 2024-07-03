import useSetRoleImageAndNameFromPlatformData from "components/[guild]/AddRewardButton/hooks/useSetRoleImageAndNameFromPlatformData"
import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import { useWatch } from "react-hook-form"
import RewardPreview from "./RewardPreview"

const TelegramPreview = (): JSX.Element => {
  const groupId = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildId",
  })
  const { data, isValidating } = useIsTGBotIn(groupId)

  useSetRoleImageAndNameFromPlatformData(data?.groupIcon, data?.groupName)

  return (
    <RewardPreview
      type="TELEGRAM"
      isLoading={isValidating}
      name={data?.groupName}
      image={data?.groupIcon}
    />
  )
}

export default TelegramPreview
