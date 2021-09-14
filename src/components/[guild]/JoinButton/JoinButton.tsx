import { Box, Tooltip, useDisclosure } from "@chakra-ui/react"
import CtaButton from "components/common/CtaButton"
import { useGuild } from "../Context"
import JoinModal from "./components/JoinModal"
import JoinDiscordModal from "./components/JoinModal/JoinDiscordModal"
import useLevelsAccess from "./hooks/useLevelsAccess"

const JoinButton = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const guildData = useGuild()
  const { data: hasAccess, error } = useLevelsAccess()

  if (!hasAccess)
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
      {guildData.communityPlatforms?.[0]?.name === "DISCORD" ? (
        <JoinDiscordModal {...{ isOpen, onClose }} />
      ) : (
        <JoinModal {...{ isOpen, onClose }} />
      )}
    </>
  )
}

export default JoinButton
