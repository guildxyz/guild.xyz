import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useServerData from "hooks/useServerData"
import dynamic from "next/dynamic"
import { PropsWithChildren, useEffect, useState } from "react"
import { Platform, Rest } from "types"
import PlatformCard from "../../PlatformCard"
type Props = {
  guildPlatform: Platform
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
} & Rest

const DiscordCard = ({
  guildPlatform,
  actionRow,
  cornerButton,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const serverData = useServerData(guildPlatform.platformGuildId, {
    revalidateOnFocus: false,
  })
  const { isAdmin } = useGuildPermission()

  const [DynamicDiscordCardMenu, setDynamicDiscordCardMenu] = useState(null)

  useEffect(() => {
    if (!isAdmin) return
    const DiscordCardMenu = dynamic(() => import("./components/DiscordCardMenu"))
    setDynamicDiscordCardMenu(DiscordCardMenu)
  }, [isAdmin])

  return (
    <PlatformCard
      type="DISCORD"
      imageUrl={serverData?.data?.serverIcon || "/default_discord_icon.png"}
      name={serverData?.data?.serverName || ""}
      actionRow={actionRow}
      cornerButton={
        cornerButton ??
        (DynamicDiscordCardMenu && (
          <DynamicDiscordCardMenu discordServerId={guildPlatform.platformGuildId} />
        ))
      }
      {...rest}
    >
      {children}
    </PlatformCard>
  )
}

export default DiscordCard
