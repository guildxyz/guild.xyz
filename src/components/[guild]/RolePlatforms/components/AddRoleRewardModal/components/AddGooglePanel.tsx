import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { Visibility } from "types"

type Props = {
  onSuccess: () => void
  skipSettings?: boolean
}

const defaultValues = {
  platformGuildId: null,
}

const AddGooglePanel = ({ onSuccess, skipSettings }: Props): JSX.Element => {
  const methods = useForm({
    mode: "all",
    defaultValues,
  })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const roleVisibility: Visibility = useWatch({ name: ".visibility" })

  return (
    <FormProvider {...methods}>
      <GoogleGuildSetup
        defaultValues={defaultValues}
        onSelect={(newPlatform) => {
          const { platformRoleId, ...guildPlatformData } = newPlatform
          append({
            guildPlatform: { ...guildPlatformData, platformName: "GOOGLE" },
            platformRoleId,
            isNew: true,
            visibility: roleVisibility,
          })
          onSuccess?.()
        }}
        skipSettings={skipSettings}
      />
    </FormProvider>
  )
}

export default AddGooglePanel
