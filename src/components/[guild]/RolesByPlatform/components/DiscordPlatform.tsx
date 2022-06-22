import useServerData from "hooks/useServerData"
import { Platform as PlatformType } from "types"
import Platform from "./Platform"

const DiscordPlatform = ({ platform }: { platform: PlatformType }) => {
  const { data } = useServerData(platform?.platformGuildId)

  return <Platform platform={platform} name={data?.serverName} />
}

export default DiscordPlatform
