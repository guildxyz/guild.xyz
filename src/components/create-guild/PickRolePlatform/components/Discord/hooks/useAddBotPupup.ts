import { useEffect, useState } from "react"
import { useWatch } from "react-hook-form"
import useServerData from "./useServerData"

const OAUTH_URI = `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`

const useAddBotPopup = () => {
  const [popup, setPopup] = useState<Window>(null)
  const invite = useWatch({ name: "discord_invite" })
  const {
    data: { channels },
  } = useServerData(invite, {
    refreshInterval: !!popup ? 1000 : 0,
  })

  const openWindow = () => {
    setPopup(window.open(OAUTH_URI, "_blank", "height=750,width=600,scrollbars"))
  }

  useEffect(() => {
    if (channels?.length > 0 && popup) {
      popup.close()
      setPopup(null)
    }
  }, [channels, popup])

  return { openWindow, isOpen: !!popup }
}

export default useAddBotPopup
