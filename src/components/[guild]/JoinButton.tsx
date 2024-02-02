import { Box, useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useOpenJoinModal } from "./JoinModal/JoinModalProvider"
import useAccess from "./hooks/useAccess"

const JoinButton = (): JSX.Element => {
  const openJoinModal = useOpenJoinModal()
  const { isLoading } = useAccess()

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

  return (
    <Button h="10" flexShrink="0" onClick={openJoinModal} colorScheme="green">
      {buttonText}
    </Button>
  )
}

export default JoinButton
