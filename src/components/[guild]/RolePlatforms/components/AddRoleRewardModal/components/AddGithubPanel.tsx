import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import GitHubGuildSetup from "components/common/GitHubGuildSetup"
import { AddRewardPanelProps } from "platforms/rewards"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformType } from "types"
import DefaultAddRewardPanelWrapper from "../DefaultAddRewardPanelWrapper"

const defaultValues = {
  platformGuildId: null,
}

const AddGithubPanel = ({ onAdd }: AddRewardPanelProps) => {
  const methods = useForm({ mode: "all", defaultValues })
  useAddRewardDiscardAlert(methods.formState.isDirty)

  return (
    <FormProvider {...methods}>
      <DefaultAddRewardPanelWrapper>
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
      </DefaultAddRewardPanelWrapper>
    </FormProvider>
  )
}

export default AddGithubPanel
