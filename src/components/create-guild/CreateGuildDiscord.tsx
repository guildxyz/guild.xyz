import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"
import useIsConnected from "hooks/useIsConnected"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import { defaultValues, useCreateGuildContext } from "./CreateGuildContext"
import Pagination from "./Pagination"

const CreateGuildDiscord = (): JSX.Element => {
  const router = useRouter()
  const isConnected = useIsConnected("DISCORD")

  useEffect(() => {
    if (!isConnected) {
      router.push("/create-guild")
    }
  }, [isConnected])

  const { nextStep } = useCreateGuildContext()

  const { control } = useFormContext<GuildFormType>()

  const selectedServer = useWatch({
    control: control,
    name: "guildPlatforms.0.platformGuildId",
  })

  return (
    <>
      <DiscordGuildSetup
        defaultValues={defaultValues.DISCORD}
        selectedServer={selectedServer}
        fieldName="guildPlatforms.0.platformGuildId"
        onSubmit={nextStep}
      >
        <DiscordRoleVideo />
      </DiscordGuildSetup>

      <Pagination nextButtonHidden />
    </>
  )
}

export default CreateGuildDiscord
