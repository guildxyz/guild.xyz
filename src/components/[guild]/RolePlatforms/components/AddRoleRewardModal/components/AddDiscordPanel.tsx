import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { Visibility } from "types"

type Props = {
  onSuccess: () => void
}

const defaultValues = {
  platformGuildId: null,
}

const AddDiscordPanel = ({ onSuccess }: Props) => {
  const methods = useForm({ mode: "all", defaultValues })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const rolePlatforms = useWatch({ name: "rolePlatforms" })

  const platformGuildId = useWatch({
    control: methods.control,
    name: `platformGuildId`,
  })

  return (
    <FormProvider {...methods}>
      <DiscordGuildSetup
        rolePlatforms={rolePlatforms}
        fieldName={`platformGuildId`}
        selectedServer={platformGuildId}
        defaultValues={defaultValues}
        onSubmit={() => {
          append({
            guildPlatform: { platformName: "DISCORD", platformGuildId },
            isNew: true,
            platformRoleId: null,
            visibility: Visibility.PUBLIC,
          })
          onSuccess()
        }}
      />
    </FormProvider>
  )
}

export default AddDiscordPanel
