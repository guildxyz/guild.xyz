import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react"
import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import useGateables from "hooks/useGateables"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { GuildFormType, PlatformGuildData, PlatformType } from "types"
import getRandomInt from "utils/getRandomInt"
import { useCreateGuildContext } from "../../CreateGuildContext"

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

  const discordServers = useGateables(PlatformType.DISCORD)

  const selectedDiscordServerData = discordServers.gateables?.find(
    (server) => server.id === discordMethods.getValues("discordServerId")
  )

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
            defaultValues={{
              name: "",
              description: "",
              imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
              contacts: [{ type: "EMAIL", contact: "" }],
              guildPlatforms: [
                {
                  platformName: "DISCORD",
                  platformGuildId: "",
                },
              ],
            }}
            selectedServer={selectedServer}
            fieldName={`discordServerId`}
          />
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="green"
          isDisabled={!selectedServer}
          onClick={() => {
            append({
              platformName: "DISCORD",
              platformGuildId: discordMethods.getValues("discordServerId"),
              platformId: PlatformType.DISCORD,
              platformGuildData: {
                name: selectedDiscordServerData.name,
                imageUrl: selectedDiscordServerData.img,
              } as PlatformGuildData["DISCORD"],
            })
            setPlatform(null)
          }}
        >
          Add
        </Button>
      </ModalFooter>
    </>
  )
}

export default CreateGuildDiscord
