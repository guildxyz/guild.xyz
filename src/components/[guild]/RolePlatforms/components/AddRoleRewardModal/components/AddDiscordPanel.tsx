import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import { AddRewardPanelProps } from "platforms/rewards"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformType } from "types"

const defaultValues = {
  platformGuildId: null,
}

const AddDiscordPanel = ({ onAdd }: AddRewardPanelProps) => {
  const methods = useForm({ mode: "all", defaultValues })

  const platformGuildId = useWatch({
    control: methods.control,
    name: `platformGuildId`,
  })

  // TODO: we could somehow extract this piece of logis from here to make sure that AddDiscordPanel doesn't depend on the role form's state
  const rolePlatforms = useWatch({ name: "rolePlatforms" })

  return (
    <FormProvider {...methods}>
      <DiscordGuildSetup
        rolePlatforms={rolePlatforms}
        fieldName={`platformGuildId`}
        selectedServer={platformGuildId}
        defaultValues={defaultValues}
        onSubmit={() =>
          onAdd({
            guildPlatform: {
              platformName: "DISCORD",
              platformId: PlatformType.DISCORD,
              platformGuildId,
            },
            isNew: true,
            platformRoleId: null,
          })
        }
      />
    </FormProvider>
  )
}

export default AddDiscordPanel
