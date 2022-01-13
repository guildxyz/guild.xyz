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
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import { SignOut } from "phosphor-react"
import { useRef } from "react"

const LeaveButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  return (
    <>
      <IconButton
        aria-label="Leave guild"
        icon={<Icon as={SignOut} />}
        onClick={onOpen}
        w={10}
        h={10}
        colorScheme="red"
      />

      <AlertDialog
        motionPreset={transition}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>We'll miss you!</AlertDialogHeader>
          <AlertDialogBody>
            You're about to leave this guild. If you change your mind, you can join
            this guild again, as long as you satisfy the requirements of at least one
            roles in it.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" ml={3}>
              Leave guild
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default LeaveButton
