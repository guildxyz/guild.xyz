import { Tooltip, useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useAccess from "../../hooks/useAccess"
import useJoinSuccessToast from "./components/JoinModal/hooks/useJoinSuccessToast"
import JoinDiscordModal from "./components/JoinModal/JoinDiscordModal"
import JoinModal from "./components/JoinModal/JoinModal"
import JoinTelegramModal from "./components/JoinModal/JoinTelegramModal"
import useIsMember from "./hooks/useIsMember"
import { PlatformName } from "./platformsContent"

type Props = {
  platform: PlatformName
  roleIds: Array<number>
}

const styleProps = { h: 10, flexShrink: 0 }

const JoinButton = ({ platform, roleIds }: Props): JSX.Element => {
  const { active } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { hasAccess, isLoading } = useAccess(roleIds)
  const isMember = useIsMember()

  useJoinSuccessToast(onClose, platform)
  const router = useRouter()

  useEffect(() => {
    if (hasAccess && router.query.discordId) onOpen()
  }, [hasAccess])

  if (!active)
    return (
      <Tooltip label="Wallet not connected" shouldWrapChildren>
        <Button {...styleProps} disabled>
          Join
        </Button>
      </Tooltip>
    )

  if (isLoading) {
    return <Button {...styleProps} isLoading loadingText="Checking access" />
  }

  if (isMember)
    return (
      <Button {...styleProps} disabled colorScheme="green">
        You're in
      </Button>
    )

  if (!hasAccess)
    return (
      <Tooltip label="You don't satisfy all requirements" shouldWrapChildren>
        <Button {...styleProps} disabled>
          No access
        </Button>
      </Tooltip>
    )

  return (
    <>
      <Button
        {...styleProps}
        onClick={onOpen}
        colorScheme="green"
        data-dd-action-name="Join"
      >
        Join
      </Button>
      {platform === "TELEGRAM" ? (
        <JoinTelegramModal {...{ isOpen, onClose }} />
      ) : platform === "DISCORD" ? (
        <JoinDiscordModal {...{ isOpen, onClose }} />
      ) : (
        <JoinModal {...{ isOpen, onClose }} />
      )}
    </>
  )
}

export default JoinButton
