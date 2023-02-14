import GitHubGuildSetup from "components/common/GitHubGuildSetup"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"

type Props = {
  showRoleSelect: () => void
}

const defaultValues = {
  platformGuildId: null,
}

const AddGithubPanel = ({ showRoleSelect }: Props) => {
  const methods = useForm({ mode: "all", defaultValues })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  return (
    <FormProvider {...methods}>
      <GitHubGuildSetup
        onSelection={(platformGuildId) => {
          append({
            guildPlatform: {
              platformName: "GITHUB",
              platformGuildId: encodeURIComponent(platformGuildId),
            },
            isNew: true,
          })
          showRoleSelect()
        }}
      />
    </FormProvider>
  )
}

export default AddGithubPanel
