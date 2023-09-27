import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import { useRef } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  isCreateRoleLoading: boolean
}

const HiddenRoleAlert = ({
  isOpen,
  onClose,
  onAccept,
  isCreateRoleLoading,
}: Props) => {
  const cancelRef = useRef()

  return (
    <Alert leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Creating a hidden role</AlertDialogHeader>

          <AlertDialogBody>
            Since you haven't picked an existing role for your reward, we'll create
            an empty hidden role for it, so you can finish its setup later.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              isDisabled={isCreateRoleLoading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="green"
              ml={3}
              onClick={onAccept}
              isLoading={isCreateRoleLoading}
              loadingText="Creating role"
            >
              Okay
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </Alert>
  )
}
export default HiddenRoleAlert
