import useSetRoleImageAndNameFromPlatformData from "components/[guild]/AddRewardButton/hooks/useSetRoleImageAndNameFromPlatformData"
import useServerData from "hooks/useServerData"
import { useWatch } from "react-hook-form"
import PlatformPreview from "./PlatformPreview"

const DiscordPreview = (): JSX.Element => {
  const serverId = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildId",
  })
  const { data, isValidating } = useServerData(serverId)

  useSetRoleImageAndNameFromPlatformData(data?.serverIcon, data?.serverName)

  return (
    <PlatformPreview
      type="DISCORD"
      isLoading={isValidating}
      name={data?.serverName}
      image={data?.serverIcon}
    />
  )
}

export default DiscordPreview
