import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"

type Props = {
  onClose: () => void
}

const defaultValues = {
  platformGuildId: null,
}

const AddGooglePanel = ({ onClose }: Props): JSX.Element => {
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
          append({
            guildPlatform: { ...newPlatform, platformName: "GOOGLE", isNew: true },
          })
          onClose()
        }}
      />
    </FormProvider>
  )
}

export default AddGooglePanel
