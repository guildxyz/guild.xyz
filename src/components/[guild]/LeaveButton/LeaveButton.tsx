import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  IconButton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import { Alert } from "components/common/Modal"
import useGuild from "components/[guild]/hooks/useGuild"
import { SignOut } from "phosphor-react"
import { useEffect, useRef } from "react"
import useIsServerMember from "../hooks/useIsServerMember"
import useLeaveGuild from "./hooks/useLeaveGuild"

const LeaveButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  const { id: guildId, platforms } = useGuild()
  const isMember = useIsServerMember(platforms?.[0]?.roles?.map((role) => role.id))
  const { onSubmit, isLoading, response } = useLeaveGuild()

  useEffect(() => {
    if (response) onClose()
  }, [response])

  if (!isMember) return null

  return (
    <>
      <Tooltip label="Leave guild">
        <IconButton
          aria-label="Leave guild"
          icon={<Icon as={SignOut} />}
          onClick={onOpen}
          minW={"44px"}
          rounded="2xl"
          colorScheme="alpha"
        />
      </Tooltip>

      <Alert leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen}>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Leave guild</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure? You'll be able to join again as long as you satisfy the
            requirements of at least one role in it.
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
            >
              Leave guild
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Alert>
    </>
  )
}

export default LeaveButton
