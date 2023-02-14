import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"

type Props = {
  showRoleSelect: () => void
}

const defaultValues = {
  platformGuildId: null,
}

const AddDiscordPanel = ({ showRoleSelect }: Props) => {
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
          })
          showRoleSelect()
        }}
      />
    </FormProvider>
  )
}

export default AddDiscordPanel
