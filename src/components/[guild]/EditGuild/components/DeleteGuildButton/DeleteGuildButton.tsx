import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  FormLabel,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import DeleteButton from "components/[guild]/DeleteButton"
import ShouldKeepPlatformAccesses from "components/[guild]/ShouldKeepPlatformAccesses"
import { useRef, useState } from "react"
import useDeleteGuild from "./hooks/useDeleteGuild"

type Props = {
  beforeDelete?: () => void
}

const DeleteGuildButton = ({ beforeDelete }: Props): JSX.Element => {
  const [removeAccess, setRemoveAccess] = useState(false)
  const { onSubmit, isLoading, signLoadingText } = useDeleteGuild()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  return (
    <>
      <DeleteButton label="Delete guild" onClick={onOpen} />
      <Alert
        leastDestructiveRef={cancelRef}
        {...{ isOpen, onClose }}
        size="xl"
        colorScheme={"dark"}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete guild</AlertDialogHeader>
            <AlertDialogBody>
              <FormLabel mb="3">
                What to do with existing members on the platforms?
              </FormLabel>
              <ShouldKeepPlatformAccesses
                keepAccessDescription="Everything on the platforms will remain as is for existing members, but accesses by this guild won’t be managed anymore"
                revokeAccessDescription="Existing members will lose every access granted by this guild"
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
                loadingText={signLoadingText || "Deleting"}
                onClick={() => {
                  beforeDelete?.()
                  onSubmit({ removePlatformAccess: removeAccess })
                }}
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
