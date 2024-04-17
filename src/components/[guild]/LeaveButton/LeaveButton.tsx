import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  IconButton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import useMembership from "components/explorer/hooks/useMembership"
import { SignOut } from "phosphor-react"
import { useRef } from "react"
import { useIsTabsStuck } from "../Tabs/Tabs"
import { useThemeContext } from "../ThemeContext"
import useLeaveGuild from "./hooks/useLeaveGuild"

const LeaveButton = ({ disableColoring = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  const { id: guildId } = useGuild()
  const { isMember } = useMembership()
  const { onSubmit, isLoading } = useLeaveGuild(onClose)

  const { isStuck } = useIsTabsStuck() ?? {}
  const { textColor, buttonColorScheme } = useThemeContext()

  if (!isMember) return null

  return (
    <>
      <Tooltip label="Leave guild" hasArrow>
        <IconButton
          aria-label="Leave guild"
          icon={<SignOut />}
          onClick={onOpen}
          minW={"44px"}
          variant="ghost"
          rounded="full"
          {...(!isStuck &&
            !disableColoring && {
              color: textColor,
              colorScheme: buttonColorScheme,
            })}
        />
      </Tooltip>

      <Alert leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen}>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader pb="5">Leave guild</AlertDialogHeader>
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
