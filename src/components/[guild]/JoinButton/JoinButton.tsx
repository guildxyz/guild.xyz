import { Box, Tooltip, useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CtaButton from "components/common/CtaButton"
import { useMemo } from "react"
import { useGuild } from "../Context"
import JoinModal from "./components/JoinModal"
import useJoinSuccessToast from "./components/JoinModal/hooks/useJoinSuccessToast"
import JoinDiscordModal from "./components/JoinModal/JoinDiscordModal"
import useIsMember from "./hooks/useIsMember"
import useLevelsAccess from "./hooks/useLevelsAccess"

const JoinButton = (): JSX.Element => {
  const { account, active } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { communityPlatforms, owner } = useGuild()
  const { data: hasAccess, error } = useLevelsAccess()
  const isMember = useIsMember()
  useJoinSuccessToast(communityPlatforms[0].name)

  const isOwner = useMemo(
    () =>
      owner?.addresses
        ?.map((user) => user.address)
        ?.includes(account?.toLowerCase()),
    [account, owner]
  )

  if (!active)
    return (
      <Tooltip label={error ?? "Wallet not connected"}>
        <Box>
          <CtaButton disabled>Join Guild</CtaButton>
        </Box>
      </Tooltip>
    )

  if (isMember) return <CtaButton disabled>You're in</CtaButton>

  if (hasAccess === undefined && !isOwner) {
    return <CtaButton isLoading loadingText="Checking access" disabled />
  }

  if (!hasAccess && !isOwner)
    return (
      <Tooltip label={error ?? "You don't satisfy all requirements"}>
        <Box>
          <CtaButton disabled>No access</CtaButton>
        </Box>
      </Tooltip>
    )

  return (
    <>
      <CtaButton onClick={onOpen}>Join Guild</CtaButton>
      {communityPlatforms[0].name === "DISCORD" ? (
        <JoinDiscordModal {...{ isOpen, onClose }} />
      ) : (
        <JoinModal {...{ isOpen, onClose }} />
      )}
    </>
  )
}

export default JoinButton
