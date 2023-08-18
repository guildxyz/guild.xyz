import { PlatformName } from "types"
import { useCreateGuildContext } from "../CreateGuildContext"
import CreateGuildContractCall from "./components/CreateGuildContractCall"
import CreateGuildDiscord from "./components/CreateGuildDiscord"
import CreateGuildGithub from "./components/CreateGuildGithub"
import CreateGuildGoogle from "./components/CreateGuildGoogle"
import CreateGuildTelegram from "./components/CreateGuildTelegram"

// TODO: we could move these to platforms.tsx too?
const createGuildPlatformComponents: Partial<
  Record<PlatformName, () => JSX.Element>
> = {
  DISCORD: CreateGuildDiscord,
  TELEGRAM: CreateGuildTelegram,
  GOOGLE: CreateGuildGoogle,
  GITHUB: CreateGuildGithub,
  CONTRACT_CALL: CreateGuildContractCall,
}

const CreateGuildPlatform = (): JSX.Element => {
  const { platform } = useCreateGuildContext()
  const CreateGuildPlatformComponent = platform
    ? createGuildPlatformComponents[platform]
    : null

  return <CreateGuildPlatformComponent />
}

export default CreateGuildPlatform
