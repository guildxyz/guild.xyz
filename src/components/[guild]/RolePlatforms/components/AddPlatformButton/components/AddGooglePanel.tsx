import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"

type Props = {
  onClose: () => void
}

const AddGooglePanel = ({ onClose }: Props): JSX.Element => {
  const methods = useForm({
    mode: "all",
    defaultValues: {
      platformGuildId: null,
    },
  })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  return (
    <FormProvider {...methods}>
      <GoogleGuildSetup
        fieldName="platformGuildId"
        onSelect={(newPlatformGuildId: string, newPlatformGuildName?: string) => {
          append({
            guildPlatform: {
              platformName: "GOOGLE",
              platformGuildId: newPlatformGuildId,
              platformGuildName: newPlatformGuildName ?? "Google document",
            },
          })
          onClose()
        }}
      />
    </FormProvider>
  )
}

export default AddGooglePanel
