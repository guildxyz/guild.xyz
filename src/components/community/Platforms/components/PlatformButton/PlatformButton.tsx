import { Button, useDisclosure } from "@chakra-ui/react"
import { useEffect } from "react"
import { PlatformName } from "temporaryData/types"
import platformsContent from "../../platformsContent"
import JoinModal from "../JoinModal"
import useJoinSuccessToast from "../JoinModal/hooks/useJoinSuccessToast"
import LeaveModal from "../LeaveModal"
import useIsMember from "./hooks/useIsMember"

type Props = {
  platform: PlatformName
  disabled: boolean
}

const PlatformButton = ({ platform, disabled }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { title, logo: Logo } = platformsContent[platform]
  const isMember = useIsMember(platform)
  // TODO: should be called from JoinModal or useJoinModalMachine, so it's only mounted when it's relevant.
  // Problem right now is that it unmounts too early then, we should find a solution.
  // Note: leave success toasts will be mounted from useLeaveModalMachine
  useJoinSuccessToast(platform)

  useEffect(() => {
    onClose()
  }, [isMember, onClose])

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={platform.toLowerCase()}
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
