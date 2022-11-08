import GitHubGuildSetup from "components/common/GitHubGuildSetup"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"

type Props = {
  onSuccess: () => void
}

const defaultValues = {
  platformGuildId: null,
}

const AddGithubPanel = ({ onSuccess }: Props) => {
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
          onSuccess()
        }}
      />
    </FormProvider>
  )
}

export default AddGithubPanel
