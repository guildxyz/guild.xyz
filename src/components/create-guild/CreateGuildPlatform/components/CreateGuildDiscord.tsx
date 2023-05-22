import { Text } from "@chakra-ui/react"
import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import { useWatch } from "react-hook-form"
import { defaultValues } from "../../CreateGuildContext"
import Pagination from "../../Pagination"

const CreateGuildDiscord = (): JSX.Element => {
  const selectedServer = useWatch({
    name: "guildPlatforms.0.platformGuildId",
  })

  return (
    <>
      <Text colorScheme="gray" fontWeight="semibold">
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
