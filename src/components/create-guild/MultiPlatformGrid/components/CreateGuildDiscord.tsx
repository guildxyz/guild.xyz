import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import PermissionAlert from "components/common/DiscordGuildSetup/components/PermissionAlert"
import { useFieldArray, useFormContext } from "react-hook-form"
import { GuildFormType, PlatformGuildData, PlatformType } from "types"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CreateGuildDiscord = ({ isOpen, onClose }: Props): JSX.Element => {
  const { control } = useFormContext<GuildFormType>()
  const { append } = useFieldArray({
    control,
    name: "guildPlatforms",
  })

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
            <DiscordGuildSetup
              onSubmit={(selected) => {
                append({
                  platformName: "DISCORD",
                  platformGuildId: selected?.id,
                  platformId: PlatformType.DISCORD,
                  platformGuildData: {
                    name: selected?.name,
                    imageUrl: selected?.img,
                  } as PlatformGuildData["DISCORD"],
                })
                onClose()
              }}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreateGuildDiscord
