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
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { platforms } from "components/create-guild/PlatformsGrid/PlatformsGrid"
import TelegramGroup from "components/create-guild/TelegramGroup"
import { ArrowLeft, Plus } from "phosphor-react"
import { useState } from "react"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
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

// TODO: Move these in separate files
const DC = ({ onClose }) => {
  const methods = useForm({ mode: "all", defaultValues })

  const selectedServer = useWatch({
    control: methods.control,
    name: "DISCORD.platformId",
  })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  return (
    <FormProvider {...methods}>
      <DiscordGuildSetup
        onSubmit={() => {
          append({ type: "DISCORD", platformId: selectedServer })
          onClose()
        }}
        {...{ defaultValues, selectedServer }}
      >
        <DiscordRoleVideo />
      </DiscordGuildSetup>
    </FormProvider>
  )
}

const TG = ({ onClose }) => {
  const methods = useForm({
    mode: "all",
    defaultValues: {
      platform: "TELEGRAM",
      TELEGRAM: {
        platformId: "",
      },
    },
  })

  const platformId = useWatch({
    name: "TELEGRAM.platformId",
    control: methods.control,
  })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  return (
    <FormProvider {...methods}>
      <Card p={10}>
        <TelegramGroup cols={2} />
        <HStack justifyContent={"end"} mt={5}>
          <Button
            colorScheme={"green"}
            onClick={() => {
              append({
                platformId,
                type: "TELEGRAM",
              })
              onClose()
            }}
          >
            Add Telegram
          </Button>
        </HStack>
      </Card>
    </FormProvider>
  )
}

const addPlatformComponents: Partial<Record<PlatformName, (props) => JSX.Element>> =
  {
    DISCORD: DC,
    TELEGRAM: TG,
  }

const AddPlatformButton = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [selection, setSelection] = useState<PlatformName>(null)

  const AddPlatformPanel = addPlatformComponents[selection]

  const closeModal = () => {
    setSelection(null)
    onClose()
  }

  return (
    <>
      <Tooltip label="Coming Coon!" shouldWrapChildren placement="left">
        <Button
          variant="ghost"
          size="sm"
          color="gray.400"
          leftIcon={<Plus />}
          onClick={onOpen}
          // isDisabled
        >
          Add platform
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent minW="80vw" maxH="80vh" overflowY={"auto"}>
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
              <Text>
                Add{" "}
                {(selection === null && "platform") || platforms[selection].label}
              </Text>
            </HStack>
          </ModalHeader>
          <ModalBody>
            {(selection === null && (
              <PlatformsGrid
                onSelection={setSelection}
                columns={{ base: 1, lg: 2 }}
              />
            )) || <AddPlatformPanel onClose={onClose} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddPlatformButton
