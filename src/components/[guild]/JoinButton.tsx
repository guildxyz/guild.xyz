import { useBreakpointValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useOpenJoinModal } from "./JoinModal/JoinModalProvider"

const JoinButton = (): JSX.Element => {
  const openJoinModal = useOpenJoinModal()

  const buttonText = useBreakpointValue({
    base: "Join Guild",
    md: "Join Guild to get roles",
  })

  return (
    <Button h="10" flexShrink="0" onClick={openJoinModal} colorScheme="green">
      {buttonText}
    </Button>
  )
}

export default JoinButton
