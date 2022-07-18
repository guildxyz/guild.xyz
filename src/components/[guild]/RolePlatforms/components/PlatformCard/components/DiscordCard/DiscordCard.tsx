import useServerData from "hooks/useServerData"
import { PropsWithChildren } from "react"
import { useRolePlatform } from "../../../RolePlatformProvider"
import PlatformCard from "../../PlatformCard"

type Props = {
  actionRow?: JSX.Element
  onRemove?: () => void
}

const DiscordCard = ({
  actionRow,
  onRemove,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { guildPlatform } = useRolePlatform()
  const serverData = useServerData(guildPlatform.platformGuildId)

  return (
    <PlatformCard
      type="DISCORD"
      colSpan={2}
      imageUrl={serverData?.data?.serverIcon || "/default_discord_icon.png"}
      name={serverData?.data?.serverName || ""}
      onRemove={onRemove}
      actionRow={actionRow}
    >
      {children}
    </PlatformCard>
  )
}

export default DiscordCard
