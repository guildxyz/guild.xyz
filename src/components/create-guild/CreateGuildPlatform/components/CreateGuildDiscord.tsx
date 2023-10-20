import {
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react"
import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import { defaultValues, useCreateGuildContext } from "../../CreateGuildContext"
import Pagination from "../../Pagination"

const CreateGuildDiscord = (): JSX.Element => {
  const selectedServer = useWatch({
    name: "guildPlatforms.0.platformGuildId",
  })
  const { setPlatform } = useCreateGuildContext()
  const { control } = useFormContext<GuildFormType>()
  const { fields } = useFieldArray({
    control,
    name: "guildPlatforms",
  })

  return (
    <>
      <ModalHeader>Connect to Discord</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text colorScheme="gray" fontWeight="semibold">
          Adding the bot and creating the Guild won't change anything on your server
        </Text>
        <DiscordGuildSetup
          defaultValues={defaultValues.DISCORD}
          selectedServer={selectedServer}
          fieldName={`guildPlatforms.${fields.length}.platformGuildId`}
        />
      </ModalBody>
      <ModalFooter>
        <Pagination
          nextButtonDisabled={!selectedServer}
          nextStepHandler={() => {
            setPlatform("DEFAULT")
          }}
        />
      </ModalFooter>
    </>
  )
}

export default CreateGuildDiscord
