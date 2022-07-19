import useServerData from "hooks/useServerData"
import { PropsWithChildren } from "react"
import { Platform, Rest } from "types"
import PlatformCard from "../../PlatformCard"
import DiscordCardMenu from "./components/DiscordCardMenu"

type Props = {
  guildPlatform: Platform
  actionRow?: JSX.Element
  onRemove?: () => void
} & Rest

const DiscordCard = ({
  guildPlatform,
  actionRow,
  onRemove,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const serverData = useServerData(guildPlatform.platformGuildId)

  return (
    <PlatformCard
      type="DISCORD"
      colSpan={2}
      imageUrl={serverData?.data?.serverIcon || "/default_discord_icon.png"}
      name={serverData?.data?.serverName || ""}
      onRemove={onRemove}
      actionRow={actionRow}
      cornerButton={<DiscordCardMenu />}
      {...rest}
    >
      {children}
    </PlatformCard>
  )
}

export default DiscordCard
