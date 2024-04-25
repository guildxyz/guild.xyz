import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import PermissionAlert from "components/common/DiscordGuildSetup/components/PermissionAlert"
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

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CreateGuildDiscord = ({ isOpen, onClose }: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      colorScheme="dark"
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect to Discord</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column">
          <Text colorScheme="gray" fontWeight="semibold" mb={4}>
            Adding the bot and creating the Guild won't change anything on your
            server
          </Text>
          <PermissionAlert mb={4} />
          <Box
            overflow="auto"
            className="invisible-scrollbar"
            sx={{
              maskImage:
                "linear-gradient(to bottom, transparent 0px, black var(--chakra-sizes-4), black calc(100% - var(--chakra-sizes-4)), transparent)",
            }}
            py={4}
          >
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
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            isDisabled={!selectedServer}
            onClick={() => {
              captureEvent("[discord setup] server added")

              append({
                platformName: "DISCORD",
                platformGuildId: discordMethods.getValues("discordServerId"),
                platformId: PlatformType.DISCORD,
                platformGuildData: {
                  name: selectedDiscordServerData.name,
                  imageUrl: selectedDiscordServerData.img,
                } as PlatformGuildData["DISCORD"],
              })
              onClose()
            }}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateGuildDiscord
