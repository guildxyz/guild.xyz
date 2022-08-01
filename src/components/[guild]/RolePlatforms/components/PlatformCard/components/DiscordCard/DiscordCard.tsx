import useServerData from "hooks/useServerData"
import { PropsWithChildren } from "react"
import { Platform, Rest } from "types"
import PlatformCard from "../../PlatformCard"

import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
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
      image={serverData?.data?.serverIcon || "/default_discord_icon.png"}
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
