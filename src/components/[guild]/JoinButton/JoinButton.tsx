import { Box, Tooltip, useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CtaButton from "components/common/CtaButton"
import { useGuild } from "../Context"
import JoinDiscordModal from "./components/JoinModal"
import useJoinSuccessToast from "./components/JoinModal/hooks/useJoinSuccessToast"
import useIsMember from "./hooks/useIsMember"
import useLevelsAccess from "./hooks/useLevelsAccess"

const JoinButton = (): JSX.Element => {
  const { active, account } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { communityPlatforms } = useGuild()
  const { data: hasAccess, error } = useLevelsAccess()
  const isMember = useIsMember()
  useJoinSuccessToast(communityPlatforms[0].name)

  if (!active)
    return (
      <Tooltip label={error ?? "Wallet not connected"}>
        <Box>
          <CtaButton disabled>Join Guild</CtaButton>
        </Box>
      </Tooltip>
    )

  if (isMember) return <CtaButton disabled>You're in</CtaButton>

  if (hasAccess === undefined) {
    return <CtaButton isLoading loadingText="Checking access" disabled />
  }

  if (!hasAccess)
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
      <JoinDiscordModal {...{ isOpen, onClose }} />
      {/* {communityPlatforms[0].name === "DISCORD"} */}
    </>
  )
}

export default JoinButton
