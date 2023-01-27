import GitHubGuildSetup from "components/common/GitHubGuildSetup"
import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
import Pagination from "components/create-guild/Pagination"
import { useFormContext } from "react-hook-form"
import { GuildFormType } from "types"

const CreateGuildGithub = (): JSX.Element => {
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
