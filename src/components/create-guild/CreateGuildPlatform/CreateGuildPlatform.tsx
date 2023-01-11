import { PlatformName } from "types"
import CreateGuildWithoutPlatform from "../BasicInfo/components/PlatformlessGuildForm"
import { useCreateGuildContext } from "../CreateGuildContext"
import CreateGuildDiscord from "./components/CreateGuildDiscord"
import CreateGuildGithub from "./components/CreateGuildGithub"
import CreateGuildGoogle from "./components/CreateGuildGoogle"
import CreateGuildTelegram from "./components/CreateGuildTelegram"

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
