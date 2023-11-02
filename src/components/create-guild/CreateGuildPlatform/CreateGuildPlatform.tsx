import { ModalContent, ModalOverlay } from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { PlatformName } from "types"
import { useCreateGuildContext } from "../CreateGuildContext"
import CreateGuildContractCall from "./components/CreateGuildContractCall"
import CreateGuildDiscord from "./components/CreateGuildDiscord"
import CreateGuildGithub from "./components/CreateGuildGithub"
import CreateGuildGoogle from "./components/CreateGuildGoogle"
import CreateGuildSecretText from "./components/CreateGuildSecretText"
import CreateGuildTelegram from "./components/CreateGuildTelegram"
import CreateGuildTwitter from "./components/CreateGuildTwitter"
import CreateGuildUniqueText from "./components/CreateGuildUniqueText"

// TODO: we could move these to platforms.tsx too?
const createGuildPlatformComponents: Record<
  Exclude<PlatformName, "POAP" | "TWITTER_V1" | "EMAIL">,
  () => JSX.Element
> = {
  DISCORD: CreateGuildDiscord,
  TELEGRAM: CreateGuildTelegram,
  GOOGLE: CreateGuildGoogle,
  GITHUB: CreateGuildGithub,
  CONTRACT_CALL: CreateGuildContractCall,
  TEXT: CreateGuildSecretText,
  TWITTER: CreateGuildTwitter,
  UNIQUE_TEXT: CreateGuildUniqueText,
}

const CreateGuildPlatform = (): JSX.Element => {
  const { platform, setPlatform } = useCreateGuildContext()
  const CreateGuildPlatformComponent = platform
    ? createGuildPlatformComponents[platform]
    : null

  return (
    <Modal
      isOpen={platform && platform !== "DEFAULT"}
      onClose={() => {
        setPlatform("DEFAULT")
      }}
      scrollBehavior="inside"
      size="3xl"
      colorScheme="dark"
    >
      <ModalOverlay />
      <ModalContent>
        <CreateGuildPlatformComponent />
      </ModalContent>
    </Modal>
  )
}

export default CreateGuildPlatform
