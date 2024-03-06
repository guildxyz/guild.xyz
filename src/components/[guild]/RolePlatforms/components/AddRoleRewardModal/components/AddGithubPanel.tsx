import GitHubGuildSetup from "components/common/GitHubGuildSetup"
import { AddPlatformPanelProps } from "platforms/platforms"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformType } from "types"

const defaultValues = {
  platformGuildId: null,
}

const AddGithubPanel = ({ onSuccess }: AddPlatformPanelProps) => {
  const methods = useForm({ mode: "all", defaultValues })

  return (
    <FormProvider {...methods}>
      <GitHubGuildSetup
        onSelection={(platformGuildId) =>
          onSuccess({
            guildPlatform: {
              platformName: "GITHUB",
              platformId: PlatformType.GITHUB,
              platformGuildId: encodeURIComponent(platformGuildId),
            },
            isNew: true,
          })
        }
      />
    </FormProvider>
  )
}

export default AddGithubPanel
