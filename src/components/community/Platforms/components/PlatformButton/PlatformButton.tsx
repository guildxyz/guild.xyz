import { Button, useDisclosure } from "@chakra-ui/react"
import { useEffect } from "react"
import platformsContent from "../../platformsContent"
import JoinModal from "../JoinModal"
import useJoinSuccessToast from "../JoinModal/hooks/useJoinSuccessToast"
import LeaveModal from "../LeaveModal"
import useIsMember from "./hooks/useIsMember"

type Props = {
  platform: string
  disabled: boolean
}

const PlatformButton = ({ platform, disabled }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { title, logo: Logo } = platformsContent[platform]
  const isMember = useIsMember(platform)

  useEffect(() => {
    onClose()
  }, [isMember, onClose])

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={platform}
        fontWeight="medium"
        leftIcon={<Logo />}
        variant={isMember ? "outline" : "solid"}
        disabled={disabled}
      >
        {`${isMember ? "Leave" : "Join"} ${title.split(" ")[0]}`}
      </Button>
      {!disabled &&
        (isMember ? (
          <LeaveModal {...{ platform, isOpen, onClose }} />
        ) : (
          <JoinModal {...{ platform, isOpen, onClose }} />
        ))}
    </>
  )
}

export default PlatformButton
