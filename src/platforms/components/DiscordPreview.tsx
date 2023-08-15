import useServerData from "hooks/useServerData"
import { useWatch } from "react-hook-form"
import PlatformPreview from "./PlatformPreview"

const DiscordPreview = (): JSX.Element => {
  const serverId = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildId",
  })
  const { data, isValidating } = useServerData(serverId)

  return (
    <PlatformPreview
      type="DISCORD"
      isValidating={isValidating}
      name={data?.serverName}
      image={data?.serverIcon}
    />
  )
}

export default DiscordPreview
