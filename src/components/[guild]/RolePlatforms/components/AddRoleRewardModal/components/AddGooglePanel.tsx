import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"

type Props = {
  showRoleSelect: () => void
  skipSettings?: boolean
}

const defaultValues = {
  platformGuildId: null,
}

const AddGooglePanel = ({ showRoleSelect, skipSettings }: Props): JSX.Element => {
  const methods = useForm({
    mode: "all",
    defaultValues,
  })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  return (
    <FormProvider {...methods}>
      <GoogleGuildSetup
        defaultValues={defaultValues}
        onSelect={(newPlatform) => {
          const { platformRoleData, ...guildPlatformData } = newPlatform
          append({
            guildPlatform: { ...guildPlatformData, platformName: "GOOGLE" },
            platformRoleData,
            isNew: true,
          })
          showRoleSelect?.()
        }}
        skipSettings={skipSettings}
      />
    </FormProvider>
  )
}

export default AddGooglePanel
