import { Box, useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import Button from "components/common/Button"
// import { useMemo } from "react"
import useAccess from "./hooks/useAccess"
import { useOpenJoinModal } from "./JoinModal/JoinModalProvider"
// import useGuild from "./hooks/useGuild"
// import usePlatformsToReconnect from "./hooks/usePlatformsToReconnect"
// import useUser from "./hooks/useUser"

const JoinButton = (): JSX.Element => {
  const openJoinModal = useOpenJoinModal()
  const { isLoading } = useAccess()
  // const { requiredPlatforms } = useGuild()
  // const { platformUsers } = useUser()
  // const platformsToReconnect = usePlatformsToReconnect()

  // const hasUnconnectedRequiredPlatforms = useMemo(() => {
  //   if (!platformUsers || !requiredPlatforms) return false

  //   const connectedPlatforms = platformUsers.map(
  //     (platformUser) => platformUser.platformName
  //   )
  //   return requiredPlatforms.some(
  //     (platformName) => !connectedPlatforms.includes(platformName)
  //   )
  // }, [platformUsers, requiredPlatforms])

  // const shouldConnect =
  //   hasUnconnectedRequiredPlatforms || platformsToReconnect?.length > 0

  const buttonText = useBreakpointValue({
    base: "Join Guild",
    md: "Join Guild to get roles",
  })

  const bg = useColorModeValue("gray.300", "gray.800")

  if (isLoading)
    return (
      <Box bg={bg} borderRadius={"xl"}>
        <Button h="10" colorScheme="green" isLoading loadingText="Loading">
          {buttonText}
        </Button>
      </Box>
    )

  // if (hasAccess === false && !shouldConnect)
  //   return (
  //     <Box bg={bg} borderRadius={"xl"}>
  //       <Tooltip
  //         label="You don't satisfy the requirements to any roles"
  //         shouldWrapChildren
  //       >
  //         <Button h="10" flexShrink="0" isDisabled colorScheme="green">
  //           {buttonText}
  //         </Button>
  //       </Tooltip>
  //     </Box>
  //   )

  return (
    <Button h="10" flexShrink="0" onClick={openJoinModal} colorScheme="green">
      {buttonText}
    </Button>
  )
}

export default JoinButton
