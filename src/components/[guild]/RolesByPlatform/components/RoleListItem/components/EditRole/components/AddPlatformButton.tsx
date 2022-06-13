import {
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { ArrowLeft, Plus } from "phosphor-react"
import { useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformName } from "types"

const defaultValues = {
  imageUrl: "/guildLogos/0.svg",
  platform: "DISCORD",
  DISCORD: {
    platformId: undefined,
  },
  requirements: [
    {
      type: "FREE",
    },
  ],
}

const DC = () => {
  const methods = useForm({ mode: "all", defaultValues })

  const selectedServer = useWatch({
    control: methods.control,
    name: "DISCORD.platformId",
  })

  return (
    <FormProvider {...methods}>
      <DiscordGuildSetup {...{ defaultValues, selectedServer }}>
        <DiscordRoleVideo />
      </DiscordGuildSetup>
    </FormProvider>
  )
}

const addPlatformComponents: Partial<Record<PlatformName, JSX.Element>> = {
  DISCORD: <DC />,
  TELEGRAM: <Text>TG</Text>,
}

const AddPlatformButton = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [selection, setSelection] = useState<PlatformName>(null)

  const closeModal = () => {
    setSelection(null)
    onClose()
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        color="gray.400"
        leftIcon={<Plus />}
        onClick={onOpen}
      >
        Add platform
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent minW="5xl" maxH="2xl" overflowY={"auto"}>
          <ModalHeader>
            <HStack alignItems={"center"}>
              {selection !== null && (
                <IconButton
                  rounded={"full"}
                  aria-label="Back"
                  w={10}
                  h={10}
                  icon={<ArrowLeft size={20} />}
                  variant="ghost"
                  onClick={() => setSelection(null)}
                />
              )}
              <Text>Add platform</Text>
            </HStack>
          </ModalHeader>
          <ModalBody>
            {(selection === null && <PlatformsGrid onSelection={setSelection} />) ||
              addPlatformComponents[selection]}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddPlatformButton
