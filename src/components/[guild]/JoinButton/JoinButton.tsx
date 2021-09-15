import { Box, Tooltip, useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CtaButton from "components/common/CtaButton"
import { useGuild } from "../Context"
import JoinModal from "./components/JoinModal"
import JoinDiscordModal from "./components/JoinModal/JoinDiscordModal"
import useLevelsAccess from "./hooks/useLevelsAccess"

const JoinButton = (): JSX.Element => {
  const { account } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { communityPlatforms, owner } = useGuild()
  const { data: hasAccess, error } = useLevelsAccess()

  if (
    !hasAccess &&
    !owner?.addresses?.map((user) => user.address)?.includes(account?.toLowerCase())
  )
    return (
      <Tooltip label={error ?? "You don't satisfy all requirements"}>
        <Box>
          <CtaButton onClick={onOpen} disabled>
            Join Guild
          </CtaButton>
        </Box>
      </Tooltip>
    )

  return (
    <>
      <CtaButton onClick={onOpen}>Join Guild</CtaButton>
      {communityPlatforms?.[0]?.name === "DISCORD" ? (
        <JoinDiscordModal {...{ isOpen, onClose }} />
      ) : (
        <JoinModal {...{ isOpen, onClose }} />
      )}
    </>
  )
}

export default JoinButton
