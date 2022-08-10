import GitHubGuildSetup from "components/common/GitHubGuildSetup"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"

type Props = {
  onClose: () => void
}

const defaultValues = {
  platformGuildId: null,
}

const AddGithubPanel = ({ onClose }: Props) => {
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
              isNew: true,
            },
          })
          onClose()
        }}
      />
    </FormProvider>
  )
}

export default AddGithubPanel
