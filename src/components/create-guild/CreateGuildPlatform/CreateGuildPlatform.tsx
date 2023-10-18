import { PlatformName } from "types"
import { useCreateGuildContext } from "../CreateGuildContext"
import CreateGuildContractCall from "./components/CreateGuildContractCall"
import CreateGuildDiscord from "./components/CreateGuildDiscord"
import CreateGuildGithub from "./components/CreateGuildGithub"
import CreateGuildGoogle from "./components/CreateGuildGoogle"
import CreateGuildSecretText from "./components/CreateGuildSecretText"
import CreateGuildTelegram from "./components/CreateGuildTelegram"
import CreateGuildUniqueText from "./components/CreateGuildUniqueText"

// TODO: we could move these to platforms.tsx too?
const createGuildPlatformComponents: Record<
  Exclude<PlatformName, "POAP" | "TWITTER" | "TWITTER_V1" | "EMAIL">,
  () => JSX.Element
> = {
  DISCORD: CreateGuildDiscord,
  TELEGRAM: CreateGuildTelegram,
  GOOGLE: CreateGuildGoogle,
  GITHUB: CreateGuildGithub,
  CONTRACT_CALL: CreateGuildContractCall,
  TEXT: CreateGuildSecretText,
  UNIQUE_TEXT: CreateGuildUniqueText,
}

const CreateGuildPlatform = (): JSX.Element => {
  const { platform } = useCreateGuildContext()
  const CreateGuildPlatformComponent = platform
    ? createGuildPlatformComponents[platform]
    : null

  return <CreateGuildPlatformComponent />
}

export default CreateGuildPlatform
