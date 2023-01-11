import { Text } from "@chakra-ui/react"
import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import useIsConnected from "hooks/useIsConnected"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import { defaultValues } from "../../CreateGuildContext"
import Pagination from "../../Pagination"

const CreateGuildDiscord = (): JSX.Element => {
  const router = useRouter()
  const isConnected = useIsConnected("DISCORD")

  useEffect(() => {
    if (!isConnected) {
      router.replace("/create-guild")
    }
  }, [isConnected])

  const { control } = useFormContext<GuildFormType>()

  const selectedServer = useWatch({
    control: control,
    name: "guildPlatforms.0.platformGuildId",
  })

  return (
    <>
      <Text
        colorScheme="gray"
        fontSize={{ base: "sm", md: "lg" }}
        fontWeight="semibold"
      >
        Adding the bot and creating the Guild won't change anything on your server
      </Text>

      <DiscordGuildSetup
        defaultValues={defaultValues.DISCORD}
        selectedServer={selectedServer}
        fieldName="guildPlatforms.0.platformGuildId"
      />

      <Pagination nextButtonDisabled={!selectedServer} />
    </>
  )
}

export default CreateGuildDiscord
