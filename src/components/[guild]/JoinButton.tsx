import {
  Box,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { useOpenJoinModal } from "./JoinModal/JoinModalProvider"
import useAccess from "./hooks/useAccess"

const JoinButton = (): JSX.Element => {
  const openJoinModal = useOpenJoinModal()
  const { hasAccess, isValidating } = useAccess()

  const buttonText = useBreakpointValue({
    base: "Join Guild",
    md: "Join Guild to get roles",
  })

  const bg = useColorModeValue("gray.300", "gray.800")

  if (hasAccess === false || isValidating)
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
