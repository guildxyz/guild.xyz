import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import { useRef } from "react"

type Props = {
  onSave: (e: any) => void
} & Omit<AlertDialogProps, "leastDestructiveRef" | "children">

const SaveAlert = ({ onClose, onSave, ...rest }: Props): JSX.Element => {
  const cancelRef = useRef()

  return (
    <Alert leastDestructiveRef={cancelRef} onClose={onClose} {...rest}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Edit Guild Pin?</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to make changes to your Guild Pin design? Users who
            have already minted your Guild Pin will continue to see the previous
            design, while future minters will see the updated version. Would you like
            to proceed?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={(e) => {
                onSave(e)
                onClose()
              }}
            >
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </Alert>
  )
}

export default SaveAlert
