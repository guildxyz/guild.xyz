import useGuild from "components/[guild]/hooks/useGuild"
import TextDataForm, { TextRewardForm } from "platforms/Text/TextDataForm"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { Visibility } from "types"

type Props = {
  onSuccess: () => void
}

const AddTextPanel = ({ onSuccess }: Props) => {
  const { id: guildId } = useGuild()

  const methods = useForm<TextRewardForm>({ mode: "all" })

  const roleVisibility: Visibility = useWatch({ name: ".visibility" })
  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const onContinue = (data: TextRewardForm) => {
    append({
      guildPlatform: {
        platformName: "TEXT",
        platformGuildId: `text-${guildId}-${Date.now()}`,
        platformGuildData: {
          text: data.text,
          name: data.name,
          image: data.image,
        },
      },
      isNew: true,
      visibility: roleVisibility,
    })
    onSuccess()
  }

  return (
    <FormProvider {...methods}>
      <TextDataForm onSubmit={onContinue} />
    </FormProvider>
  )
}
export default AddTextPanel
