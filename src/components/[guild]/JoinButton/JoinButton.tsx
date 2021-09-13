import { Box, Button, Tooltip, useDisclosure } from "@chakra-ui/react"
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
          <Button colorScheme="green" onClick={onOpen} disabled>
            Join Guild
          </Button>
        </Box>
      </Tooltip>
    )

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Join Guild
      </Button>
      {guildData.communityPlatforms?.[0]?.name === "DISCORD" ? (
        <JoinDiscordModal {...{ isOpen, onClose }} />
      ) : (
        <JoinModal {...{ isOpen, onClose }} />
      )}
    </>
  )
}

export default JoinButton
