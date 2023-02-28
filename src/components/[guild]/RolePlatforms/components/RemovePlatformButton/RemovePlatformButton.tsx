import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  CloseButton,
  FormLabel,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import ShouldKeepPlatformAccesses from "components/[guild]/ShouldKeepPlatformAccesses"
import { useRef, useState } from "react"
import useRemovePlatform from "./hooks/useRemovePlatform"

type Props = {
  removeButtonColor: string
}

const RemovePlatformButton = ({ removeButtonColor }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, isLoading } = useRemovePlatform(onClose)

  return (
    <>
      <Tooltip label={"Remove reward..."}>
        <CloseButton
          size="sm"
          color={removeButtonColor}
          rounded="full"
          aria-label="Remove reward"
          zIndex="1"
          onClick={onOpen}
        />
      </Tooltip>

      <RemovePlatformAlert
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </>
  )
}

type RemovePlatformAlertProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Record<string, any>) => void
  isLoading: boolean
}

const RemovePlatformAlert = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: RemovePlatformAlertProps): JSX.Element => {
  const [removeAccess, setRemoveAccess] = useState(false)
  const cancelRef = useRef()

  return (
    <Alert
      leastDestructiveRef={cancelRef}
      {...{ isOpen, onClose }}
      size="xl"
      colorScheme={"dark"}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Remove reward</AlertDialogHeader>
          <AlertDialogBody>
            <FormLabel mb="3">
              What to do with existing members on the platform?
            </FormLabel>
            <ShouldKeepPlatformAccesses
              keepAccessDescription="Everything on the platform will remain as is for existing members, but accesses by this role won’t be managed anymore"
              revokeAccessDescription="Existing members will lose their accesses on the platform granted by this role"
              onChange={(newValue) => setRemoveAccess(newValue === "true")}
              value={removeAccess as any}
            />
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              isLoading={isLoading}
              loadingText="Removing"
              onClick={() => onSubmit({ removePlatformAccess: removeAccess })}
            >
              Remove
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </Alert>
  )
}

export default RemovePlatformButton
export { RemovePlatformAlert }
