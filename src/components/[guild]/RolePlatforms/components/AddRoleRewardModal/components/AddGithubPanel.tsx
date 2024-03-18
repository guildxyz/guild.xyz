import { useSyncIsAddRewardPanelDirtyAtom } from "components/[guild]/AddRewardButton/AddRewardButton"
import GitHubGuildSetup from "components/common/GitHubGuildSetup"
import { AddRewardPanelProps } from "platforms/rewards"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformType } from "types"

const defaultValues = {
  platformGuildId: null,
}

const AddGithubPanel = ({ onAdd }: AddRewardPanelProps) => {
  const methods = useForm({ mode: "all", defaultValues })
  useSyncIsAddRewardPanelDirtyAtom(methods)

  return (
    <FormProvider {...methods}>
      <GitHubGuildSetup
        onSelection={(platformGuildId) =>
          onAdd({
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
