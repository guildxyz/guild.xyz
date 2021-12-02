import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  IconButton,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import useDelete from "components/common/DeleteCard/hooks/useDelete"
import usePersonalSign from "hooks/usePersonalSign"
import { TrashSimple } from "phosphor-react"
import { useRef } from "react"
import useHall from "./hooks/useHall"

const DeleteButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const hall = useHall()
  const { onSubmit, isLoading } = useDelete("hall", hall?.id)

  const { isSigning } = usePersonalSign()

  const cancelRef = useRef()
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  return (
    <>
      <IconButton
        minW={12}
        rounded="2xl"
        colorScheme="alpha"
        aria-label="Delete hall"
        icon={<Icon as={TrashSimple} />}
        onClick={onOpen}
      />

      <AlertDialog
        motionPreset={transition}
        leastDestructiveRef={cancelRef}
        {...{ isOpen, onClose }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete hall</AlertDialogHeader>
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
      </AlertDialog>
    </>
  )
}

export default DeleteButton
