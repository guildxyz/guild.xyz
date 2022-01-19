import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { Alert } from "components/common/Modal"
import usePersonalSign from "hooks/usePersonalSign"
import { TrashSimple } from "phosphor-react"
import { useRef } from "react"
import useDeleteGuild from "./hooks/useDeleteGuild"

const DeleteGuildButton = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, isLoading } = useDeleteGuild()
  const { isSigning } = usePersonalSign()

  const cancelRef = useRef()

  return (
    <>
      <IconButton
        aria-label="Delete guild"
        icon={<Icon as={TrashSimple} />}
        colorScheme="red"
        onClick={onOpen}
        maxW={10}
        maxH={10}
      />
      <Alert leastDestructiveRef={cancelRef} {...{ isOpen, onClose }}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete guild</AlertDialogHeader>
            <AlertDialogBody>
              <Text>Are you sure? You can't undo this action afterwards.</Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                isLoading={isLoading}
                loadingText={isSigning ? "Check your wallet" : "Deleting"}
                onClick={() => onSubmit()}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </Alert>
    </>
  )
}

export default DeleteGuildButton
