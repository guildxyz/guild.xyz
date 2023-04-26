import {
  Box,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useAccess from "./hooks/useAccess"
import { useOpenJoinModal } from "./JoinModal/JoinModalProvider"

const JoinButton = (): JSX.Element => {
  const openJoinModal = useOpenJoinModal()
  const { hasAccess, isLoading } = useAccess()

  const buttonText = useBreakpointValue({
    base: "Join Guild",
    md: "Join Guild to get roles",
  })

  const bg = useColorModeValue("gray.300", "gray.800")

  if (hasAccess === false || isLoading)
    return (
      <Box bg={bg} borderRadius={"xl"}>
        <Tooltip
          label="You don't satisfy the requirements to any roles"
          shouldWrapChildren
          isDisabled={isLoading}
        >
          <Button
            h="10"
            flexShrink="0"
            isDisabled
            colorScheme="green"
            isLoading={isLoading}
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
