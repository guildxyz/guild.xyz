import DiscordGuildSetup from "components/common/DiscordGuildSetup"
import DiscordRoleVideo from "components/common/DiscordRoleVideo"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"

type Props = {
  onClose: () => void
}

// TODO: this shouldn't be needed here, since we don't care for this form state here
const defaultValues = {
  imageUrl: "/guildLogos/0.svg",
  platform: "DISCORD",
  DISCORD: {
    platformId: undefined,
  },
  requirements: [
    {
      type: "FREE",
    },
  ],
}

const AddDiscordPanel = ({ onClose }: Props) => {
  const methods = useForm({ mode: "all", defaultValues })

  const selectedServer = useWatch({
    control: methods.control,
    name: "DISCORD.platformId",
  })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  return (
    <FormProvider {...methods}>
      <DiscordGuildSetup
        onSubmit={() => {
          append({ type: "DISCORD", platformId: selectedServer })
          onClose()
        }}
        {...{ defaultValues, selectedServer }}
      >
        <DiscordRoleVideo />
      </DiscordGuildSetup>
    </FormProvider>
  )
}

export default AddDiscordPanel
