import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useRef } from "react"
import { Rest } from "types"

type Props = {
  isOpen: boolean
  onDiscard: () => void
  onClose: () => void
} & Rest

const DiscardAlert = ({ isOpen, onClose, onDiscard }: Props): JSX.Element => {
  const cancelRef = useRef()
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  return (
    <AlertDialog
      motionPreset={transition}
      leastDestructiveRef={cancelRef}
      {...{ isOpen, onClose }}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Are you sure?</AlertDialogHeader>
          <AlertDialogBody>Do you really want to discard changes?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Keep editing
            </Button>
            <Button colorScheme="red" ml={3} onClick={onDiscard || onClose}>
              Discard changes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default DiscardAlert
