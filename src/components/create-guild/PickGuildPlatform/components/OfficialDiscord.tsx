import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"

const OfficialDiscord = () => {
  const { setValue } = useFormContext()
  const platform = useWatch({ name: "platform" })

  useEffect(() => {
    if (platform === "DISCORD") {
      setValue("discordServerId", "886314998131982336")
      setValue("inviteChannel", "886314998131982339")
    }
  }, [platform])

  return <></>
}

export default OfficialDiscord
