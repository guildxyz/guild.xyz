import useServerData from "hooks/useServerData"
import { PlatformCardProps } from "../.."
import PlatformCard from "../../PlatformCard"

const DiscordCard = ({
  guildPlatform,
  actionRow,
  children,
  ...rest
}: PlatformCardProps): JSX.Element => {
  const serverData = useServerData(guildPlatform.platformGuildId, {
    revalidateOnFocus: false,
  })

  return (
    <PlatformCard
      type="DISCORD"
      image={serverData?.data?.serverIcon || "/default_discord_icon.png"}
      name={serverData?.data?.serverName || ""}
      actionRow={actionRow}
      {...rest}
    >
      {children}
    </PlatformCard>
  )
}

export default DiscordCard
