import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import { AddRewardPanelProps } from "platforms/rewards"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformType } from "types"
import DefaultAddRewardPanelWrapper from "../DefaultAddRewardPanelWrapper"

const defaultValues = {
  platformGuildId: null,
}

const AddGooglePanel = ({
  onAdd,
  skipSettings,
}: AddRewardPanelProps): JSX.Element => {
  const methods = useForm({
    mode: "all",
    defaultValues,
  })
  useAddRewardDiscardAlert(methods.formState.isDirty)

  return (
    <FormProvider {...methods}>
      <DefaultAddRewardPanelWrapper>
        <GoogleGuildSetup
          defaultValues={defaultValues}
          onSelect={(newPlatform) => {
            const { platformRoleId, ...guildPlatformData } = newPlatform
            onAdd({
              guildPlatform: {
                ...guildPlatformData,
                platformName: "GOOGLE",
                platformId: PlatformType.GOOGLE,
              },
              platformRoleId,
              isNew: true,
            })
          }}
          skipSettings={skipSettings}
        />
      </DefaultAddRewardPanelWrapper>
    </FormProvider>
  )
}

export default AddGooglePanel
