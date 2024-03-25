import { useSyncIsAddRewardPanelDirtyAtom } from "components/[guild]/AddRewardButton/AddRewardButton"
import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import { AddRewardPanelProps } from "platforms/rewards"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformType } from "types"

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
  useSyncIsAddRewardPanelDirtyAtom(methods.formState.isDirty)

  return (
    <FormProvider {...methods}>
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
    </FormProvider>
  )
}

export default AddGooglePanel
