import {
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react"
import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { GuildFormType, PlatformType } from "types"
import { defaultValues, useCreateGuildContext } from "../../CreateGuildContext"
import Pagination from "../../Pagination"

const CreateGuildDiscord = (): JSX.Element => {
  const { setPlatform } = useCreateGuildContext()
  const { control } = useFormContext<GuildFormType>()
  const { append } = useFieldArray({
    control,
    name: "guildPlatforms",
  })
  const discordMethods = useForm({
    defaultValues: { discordServerId: "", name: "", img: undefined },
  })
  const selectedServer = useWatch({
    control: discordMethods.control,
    name: `discordServerId`,
  })

  return (
    <>
      <ModalHeader>Connect to Discord</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text colorScheme="gray" fontWeight="semibold" mb={4}>
          Adding the bot and creating the Guild won't change anything on your server
        </Text>
        <FormProvider {...discordMethods}>
          <DiscordGuildSetup
            defaultValues={defaultValues.DISCORD}
            selectedServer={selectedServer}
            fieldName={`discordServerId`}
            onSelect={(serverData) => {
              discordMethods.setValue("img", serverData.img)
              discordMethods.setValue("name", serverData.name)
            }}
          />
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <Pagination
          nextButtonDisabled={!selectedServer}
          nextStepHandler={() => {
            append({
              platformName: "DISCORD",
              platformGuildId: discordMethods.getValues("discordServerId"),
              platformId: PlatformType.DISCORD,
              platformGuildData: {
                text: undefined,
                name: discordMethods.getValues("name"),
                imageUrl: discordMethods.getValues("img"),
              },
            })
            setPlatform("DEFAULT")
          }}
        />
      </ModalFooter>
    </>
  )
}

export default CreateGuildDiscord
