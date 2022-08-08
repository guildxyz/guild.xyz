import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"

type Props = {
  onClose: () => void
  allowCurrentGuildSelection: boolean
}

const defaultValues = {
  platformGuildId: null,
}

const AddDiscordPanel = ({ onClose, allowCurrentGuildSelection = false }: Props) => {
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
        allowCurrentGuildSelection={allowCurrentGuildSelection}
        onSubmit={() => {
          append({
            guildPlatform: { platformName: "DISCORD", platformGuildId, isNew: true },
          })
          onClose()
        }}
      >
        <DiscordRoleVideo />
      </DiscordGuildSetup>
    </FormProvider>
  )
}

export default AddDiscordPanel
