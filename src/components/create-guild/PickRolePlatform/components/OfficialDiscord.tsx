import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"

const OfficialDiscord = () => {
  const { setValue } = useFormContext()
  const platform = useWatch({ name: "platform" })

  useEffect(() => {
    if (platform === "DISCORD") {
      setValue("DISCORD.platformId", "886314998131982336")
    }
  }, [platform])

  return <></>
}

export default OfficialDiscord
