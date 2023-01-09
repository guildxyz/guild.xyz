import GitHubGuildSetup from "components/common/GitHubGuildSetup"
import useIsConnected from "hooks/useIsConnected"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { GuildFormType } from "types"
import { useCreateGuildContext } from "./CreateGuildContext"
import Pagination from "./Pagination"

const CreateGuildGithub = (): JSX.Element => {
  const router = useRouter()
  const isConnected = useIsConnected("GITHUB")

  useEffect(() => {
    if (!isConnected) {
      router.push("/create-guild")
    }
  }, [isConnected])

  const { nextStep } = useCreateGuildContext()

  const { setValue } = useFormContext<GuildFormType>()

  return (
    <>
      <GitHubGuildSetup
        onSelection={(newSelectedRepo) => {
          setValue("guildPlatforms.0.platformGuildId", newSelectedRepo)
          setValue("name", newSelectedRepo)
          nextStep()
        }}
      />
      <Pagination nextButtonHidden />
    </>
  )
}

export default CreateGuildGithub
