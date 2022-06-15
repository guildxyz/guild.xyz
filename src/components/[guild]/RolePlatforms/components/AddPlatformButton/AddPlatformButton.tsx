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
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { platforms } from "components/create-guild/PlatformsGrid/PlatformsGrid"
import { ArrowLeft, Plus } from "phosphor-react"
import { useState } from "react"
import { PlatformName } from "types"
import AddDiscordPanel from "./components/AddDiscordPanel"
import AddTelegramPanel from "./components/AddTelegramPanel"

const addPlatformComponents: Partial<Record<PlatformName, (props) => JSX.Element>> =
  {
    DISCORD: AddDiscordPanel,
    TELEGRAM: AddTelegramPanel,
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
          isDisabled
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
