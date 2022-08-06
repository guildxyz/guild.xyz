import { useBreakpointValue, useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { PlatformType } from "types"
import JoinModal from "./components/JoinModal/JoinModal"

type Props = {
  platform: PlatformType
}

const JoinButton = ({ platform }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const router = useRouter()

  useEffect(() => {
    if (router.query.hash) onOpen()
  }, [router.query.hash])

  const buttonText = useBreakpointValue({
    base: "Join Guild",
    md: "Join Guild to get roles",
  })

  return (
    <>
      <Button
        h="10"
        flexShrink="0"
        onClick={onOpen}
        colorScheme="green"
        color="white !important"
        data-dd-action-name="Join"
      >
        {buttonText}
      </Button>
      <JoinModal {...{ isOpen, onClose }} />
    </>
  )
}

export default JoinButton
