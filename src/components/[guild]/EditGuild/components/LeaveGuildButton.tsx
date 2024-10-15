import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import useLeaveGuild from "components/[guild]/LeaveButton/hooks/useLeaveGuild"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import useMembership from "components/explorer/hooks/useMembership"
import { useRouter } from "next/navigation"
import { useRef } from "react"

const LeaveGuildButton = () => {
  const { isOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const router = useRouter()

  const { id: guildId } = useGuild()
  const { isMember } = useMembership()
  const { onSubmit, isLoading } = useLeaveGuild(() => router.replace("/explorer"))

  if (!isMember) return null

  return (
    <>
      <Alert leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen}>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader pb="5">Leave guild</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure? You'll lose all your roles and your admin status.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => onSubmit({ guildId })}
              isLoading={isLoading}
              data-testid="leave-alert-button"
            >
              Leave guild
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Alert>
    </>
  )
}

export default LeaveGuildButton
