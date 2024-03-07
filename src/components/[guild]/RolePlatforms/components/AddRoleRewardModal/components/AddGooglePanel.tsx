import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import { AddPlatformPanelProps } from "platforms/platforms"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformType } from "types"

const defaultValues = {
  platformGuildId: null,
}

const AddGooglePanel = ({
  onAdd,
  skipSettings,
}: AddPlatformPanelProps): JSX.Element => {
  const methods = useForm({
    mode: "all",
    defaultValues,
  })

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
