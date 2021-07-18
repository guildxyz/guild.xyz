import { Button, useDisclosure } from "@chakra-ui/react"
import platformsContent from "../../platformsContent"
import JoinModal from "../JoinModal"
import LeaveModal from "../LeaveModal"
import useIsMember from "./hooks/useIsMember"

type Props = {
  platform: string
  disabled: boolean
}

const PlatformButton = ({ platform, disabled }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { logo: Logo } = platformsContent[platform]
  const isMember = useIsMember(platform)

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
        {`${isMember ? "Leave" : "Join"} ${
          platform.charAt(0).toUpperCase() + platform.slice(1)
        }`}
      </Button>
      {isMember ? (
        <LeaveModal {...{ platform, isOpen, onClose }} />
      ) : (
        <JoinModal {...{ platform, isOpen, onClose }} />
      )}
    </>
  )
}

export default PlatformButton
