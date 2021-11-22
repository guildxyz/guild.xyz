import { Box, Tooltip, useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CtaButton from "components/common/CtaButton"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { Rest } from "types"
import useJoinSuccessToastLegacy from "./components/JoinModal/hooks/useJoinSuccessToastLegacy"
import JoinDiscordModalLegacy from "./components/JoinModal/JoinDiscordModalLegacy"
import useIsMember from "./hooks/useIsMember"
import useLevelsAccessLegacy from "./hooks/useLevelsAccessLegacy"

const JoinButtonLegacy = (props: Rest): JSX.Element => {
  const { active } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id, guildPlatforms } = useGuild()
  const { data: hasAccess, error } = useLevelsAccessLegacy(id)
  const isMember = useIsMember("guild", id)
  useJoinSuccessToastLegacy(guildPlatforms?.[0].name)
  const router = useRouter()

  useEffect(() => {
    if (hasAccess && router.query.discordId) onOpen()
  }, [hasAccess])

  if (!active)
    return (
      <Tooltip label={error ?? "Wallet not connected"}>
        <Box>
          <CtaButton disabled>Join Guild</CtaButton>
        </Box>
      </Tooltip>
    )

  if (isMember)
    return (
      <CtaButton disabled {...props}>
        You're in
      </CtaButton>
    )

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
      <CtaButton onClick={onOpen} {...props}>
        Join Guild
      </CtaButton>
      <JoinDiscordModalLegacy {...{ isOpen, onClose }} />
    </>
  )
}

export default JoinButtonLegacy
