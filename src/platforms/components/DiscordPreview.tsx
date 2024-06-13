import useSetRoleImageAndNameFromPlatformData from "components/[guild]/AddRewardButton/hooks/useSetRoleImageAndNameFromPlatformData"
import useServerData from "hooks/useServerData"
import { useWatch } from "react-hook-form"
import RewardPreview from "./RewardPreview"

const DiscordPreview = (): JSX.Element => {
  const serverId = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildId",
  })
  const { data, isValidating } = useServerData(serverId)

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  useSetRoleImageAndNameFromPlatformData(data?.serverIcon, data?.serverName)

  return (
    <RewardPreview
      type="DISCORD"
      isLoading={isValidating}
      name={data?.serverName}
      image={data?.serverIcon}
    />
  )
}

export default DiscordPreview
