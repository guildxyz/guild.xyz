import {
  Box,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { useOpenJoinModal } from "./JoinModal/JoinModalProvider"
import useAccess from "./hooks/useAccess"
import useGuild from "./hooks/useGuild"
import usePlatformsToReconnect from "./hooks/usePlatformsToReconnect"
import useUser from "./hooks/useUser"

const JoinButton = (): JSX.Element => {
  const openJoinModal = useOpenJoinModal()
  const { hasAccess, isValidating } = useAccess()
  const { requiredPlatforms } = useGuild()
  const { platformUsers } = useUser()

  const buttonText = useBreakpointValue({
    base: "Join Guild",
    md: "Join Guild to get roles",
  })

  const bg = useColorModeValue("gray.300", "gray.800")

  const platformsToReconnect = usePlatformsToReconnect()
  const hasUnconnectedRequiredPlatforms = (requiredPlatforms ?? []).some(
    (platformName) =>
      platformUsers?.every(
        (platformUser) => platformUser.platformName !== platformName
      )
  )

  const shouldConnect =
    hasUnconnectedRequiredPlatforms || platformsToReconnect?.length > 0

  if (!shouldConnect && (hasAccess === false || isValidating))
    return (
      <Box bg={bg} borderRadius={"xl"}>
        <Tooltip
          label="You don't satisfy the requirements to any roles"
          shouldWrapChildren
          isDisabled={isValidating}
        >
          <Button
            h="10"
            flexShrink="0"
            isDisabled
            colorScheme="green"
            isLoading={isValidating}
            loadingText="Loading"
          >
            {buttonText}
          </Button>
        </Tooltip>
      </Box>
    )

  return (
    <Button
      h="10"
      flexShrink="0"
      onClick={openJoinModal}
      colorScheme="green"
      color="white !important"
    >
      {buttonText}
    </Button>
  )
}

export default JoinButton
