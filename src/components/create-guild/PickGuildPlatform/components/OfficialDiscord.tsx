import { Input } from "@chakra-ui/input"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

const OfficialDiscord = () => {
  const { register, setValue } = useFormContext()

  // temporary fix
  useEffect(() => {
    setValue("discordServerId", "886314998131982336")
  }, [])

  return (
    <>
      <Input
        type="hidden"
        value="886314998131982336"
        {...register(`discordServerId`, {
          shouldUnregister: true,
        })}
      />
      <Input
        type="hidden"
        value="886314998131982339"
        {...register(`inviteChannel`, {
          shouldUnregister: true,
        })}
      />
    </>
  )
}

export default OfficialDiscord
