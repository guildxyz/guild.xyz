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

// TODO: Move these in separate files
const DC = ({ onAdd, onClose }) => {
  const methods = useForm({ mode: "all", defaultValues })

  const selectedServer = useWatch({
    control: methods.control,
    name: "DISCORD.platformId",
  })

  return (
    <FormProvider {...methods}>
      <DiscordGuildSetup
        onSubmit={() => {
          onAdd({ type: "DISCORD", platformId: selectedServer })
          onClose()
        }}
        {...{ defaultValues, selectedServer }}
      >
        <DiscordRoleVideo />
      </DiscordGuildSetup>
    </FormProvider>
  )
}

const TG = ({ onAdd, onClose }) => {
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

  return (
    <FormProvider {...methods}>
      <Card p={10}>
        <TelegramGroup cols={2} />
        <HStack justifyContent={"end"} mt={5}>
          <Button
            colorScheme={"green"}
            onClick={() => {
              onAdd({
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
    DISCORD: ({ onAdd, onClose }) => <DC onAdd={onAdd} onClose={onClose} />,
    TELEGRAM: ({ onAdd, onClose }) => <TG onAdd={onAdd} onClose={onClose} />,
  }

type Props = {
  onAdd: (rolePlatform) => void
}

const AddPlatformButton = ({ onAdd }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [selection, setSelection] = useState<PlatformName>(null)

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
          isDisabled
        >
          Add platform
        </Button>
      </Tooltip>

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
              <Text>
                Add{" "}
                {(selection === null && "platform") || platforms[selection].label}
              </Text>
            </HStack>
          </ModalHeader>
          <ModalBody>
            {(selection === null && <PlatformsGrid onSelection={setSelection} />) ||
              addPlatformComponents[selection]({ onAdd, onClose })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddPlatformButton
