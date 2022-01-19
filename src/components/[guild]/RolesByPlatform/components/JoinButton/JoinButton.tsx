import { Button, Tooltip, useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useIsServerMember from "components/[guild]/hooks/useIsServerMember"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useAccess from "../../hooks/useAccess"
import useJoinSuccessToast from "./components/JoinModal/hooks/useJoinSuccessToast"
import JoinDiscordModal from "./components/JoinModal/JoinDiscordModal"
import JoinTelegramModal from "./components/JoinModal/JoinTelegramModal"
import { PlatformName } from "./platformsContent"

type Props = {
  platform: PlatformName
  roleIds: Array<number>
}

const JoinButton = ({ platform, roleIds }: Props): JSX.Element => {
  const { active } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { hasAccess, isLoading, error, firstRoleIdWithAccess } = useAccess(roleIds)
  const isMember = useIsServerMember(roleIds)

  useJoinSuccessToast(firstRoleIdWithAccess, onClose)
  const router = useRouter()

  useEffect(() => {
    if (hasAccess && router.query.discordId) onOpen()
  }, [hasAccess])

  if (!active)
    return (
      <Tooltip label={error ?? "Wallet not connected"} shouldWrapChildren>
        <Button minW="max-content" h={10} disabled>
          Join
        </Button>
      </Tooltip>
    )

  if (isLoading) {
    return (
      <Button minW="max-content" h={10} isLoading loadingText="Checking access" />
    )
  }

  if (isMember)
    return (
      <Button minW="max-content" h={10} disabled colorScheme="green">
        You're in
      </Button>
    )

  if (!hasAccess)
    return (
      <Tooltip
        label={error ?? "You don't satisfy all requirements"}
        shouldWrapChildren
      >
        <Button minW="max-content" h={10} disabled>
          No access
        </Button>
      </Tooltip>
    )

  return (
    <>
      <Button minW="max-content" h={10} onClick={onOpen} colorScheme="green">
        Join
      </Button>
      {platform === "TELEGRAM" ? (
        <JoinTelegramModal {...{ isOpen, onClose }} roleId={firstRoleIdWithAccess} />
      ) : (
        <JoinDiscordModal {...{ isOpen, onClose }} roleId={firstRoleIdWithAccess} />
      )}
    </>
  )
}

export default JoinButton
