import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import { FormProvider, useForm } from "react-hook-form"
import { AddRewardPanelProps } from "rewards"
import { ConnectPlatformFallback } from "solutions/components/ConnectPlatformFallback"
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
        <ConnectPlatformFallback platform="GOOGLE">
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
        </ConnectPlatformFallback>
      </DefaultAddRewardPanelWrapper>
    </FormProvider>
  )
}

export default AddGooglePanel
