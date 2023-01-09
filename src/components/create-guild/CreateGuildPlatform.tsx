import { PlatformName } from "types"
import { useCreateGuildContext } from "../create-guild/CreateGuildContext"
import CreateGuildDiscord from "../create-guild/CreateGuildDiscord"
import CreateGuildGithub from "./CreateGuildGithub"
import CreateGuildGoogle from "./CreateGuildGoogle"
import CreateGuildTelegram from "./CreateGuildTelegram"
import CreateGuildWithoutPlatform from "./CreateGuildWithoutPlatform"

const createGuildPlatformComponents: Partial<
  Record<PlatformName, () => JSX.Element>
> = {
  DISCORD: CreateGuildDiscord,
  TELEGRAM: CreateGuildTelegram,
  GOOGLE: CreateGuildGoogle,
  GITHUB: CreateGuildGithub,
}

const CreateGuildPlatform = (): JSX.Element => {
  const { platform } = useCreateGuildContext()
  const CreateGuildPlatformComponent = platform
    ? createGuildPlatformComponents[platform]
    : null

  if (!CreateGuildPlatformComponent) return <CreateGuildWithoutPlatform />

  return <CreateGuildPlatformComponent />
}

export default CreateGuildPlatform
