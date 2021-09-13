import { Button, useDisclosure } from "@chakra-ui/react"
import { useGuild } from "../Context"
import JoinModal from "./components/JoinModal"
import JoinDiscordModal from "./components/JoinModal/JoinDiscordModal"

const JoinButton = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const guildData = useGuild()

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
