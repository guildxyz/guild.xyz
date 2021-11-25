import { Button, Tooltip, useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useIsServerMember from "../hooks/useIsServerMember"
import useJoinSuccessToast from "./components/JoinModal/hooks/useJoinSuccessToast"
import JoinDiscordModal from "./components/JoinModal/JoinDiscordModal"
import useLevelsAccess from "./hooks/useLevelsAccess"

type Props = {
  guildIds: Array<number>
}

const JoinButton = ({ guildIds }: Props): JSX.Element => {
  const { active } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { hasAccess, isLoading, error, firstGuildIdWithAccess } =
    useLevelsAccess(guildIds)
  const isMember = useIsServerMember(guildIds)

  useJoinSuccessToast(firstGuildIdWithAccess, onClose)
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
      <JoinDiscordModal {...{ isOpen, onClose }} guildId={firstGuildIdWithAccess} />
    </>
  )
}

export default JoinButton
