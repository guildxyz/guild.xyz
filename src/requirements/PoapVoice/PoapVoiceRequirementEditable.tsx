import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  CloseButton,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { Alert } from "components/common/Modal"
import { useRef } from "react"
import { GuildPoap } from "types"
import useDeleteVoiceRequirement from "./hooks/useDeleteVoiceRequirement"
import PoapVoiceRequirement from "./PoapVoiceRequirement"

type Props = { guildPoap: GuildPoap }

const PoapVoiceRequirementEditable = ({ guildPoap, ...props }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  const { onSubmit: onDeleteSubmit, isLoading: isDeleteLoading } =
    useDeleteVoiceRequirement(guildPoap.poapIdentifier)

  const removeButtonColor = useColorModeValue("gray.700", "gray.400")

  return (
    <Card px="6" py="4" pr="8" pos="relative">
      <PoapVoiceRequirement {...{ guildPoap }} footer={null} />

      <CloseButton
        position="absolute"
        top={2}
        right={2}
        color={removeButtonColor}
        borderRadius={"full"}
        size="sm"
        onClick={onOpen}
        aria-label="Remove requirement"
      />

      <Alert {...{ isOpen, onClose }} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              Remove voice participation requirement
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                onClick={() => onDeleteSubmit({ poapId: guildPoap?.poapIdentifier })}
                isLoading={isDeleteLoading}
              >
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </Alert>
    </Card>
  )
}

export default PoapVoiceRequirementEditable
