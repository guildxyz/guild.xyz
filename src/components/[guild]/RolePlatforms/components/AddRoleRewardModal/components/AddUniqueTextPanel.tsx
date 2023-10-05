import Button from "components/common/Button"
import useUser from "components/[guild]/hooks/useUser"
import UniqueTextDataForm, {
  UniqueTextRewardForm,
} from "platforms/UniqueText/UniqueTextDataForm"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { Visibility } from "types"

type Props = {
  onSuccess: () => void
}

const AddUniqueTextPanel = ({ onSuccess }: Props) => {
  const { id: userId } = useUser()

  const methods = useForm<UniqueTextRewardForm>({ mode: "all" })

  const name = useWatch({ control: methods.control, name: "name" })

  const roleVisibility: Visibility = useWatch({ name: ".visibility" })
  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const onContinue = (data: UniqueTextRewardForm) => {
    append({
      guildPlatform: {
        platformName: "UNIQUE_TEXT",
        platformGuildId: `unique-text-${userId}-${Date.now()}`,
        platformGuildData: {
          texts: data.texts?.filter(Boolean) ?? [],
          name: data.name,
          imageUrl: data.imageUrl,
        },
      },
      isNew: true,
      visibility: roleVisibility,
    })
    onSuccess()
  }

  return (
    <FormProvider {...methods}>
      <UniqueTextDataForm>
        <Button
          colorScheme="indigo"
          isDisabled={!name?.length}
          w="max-content"
          ml="auto"
          onClick={methods.handleSubmit(onContinue)}
        >
          Continue
        </Button>
      </UniqueTextDataForm>
    </FormProvider>
  )
}
export default AddUniqueTextPanel
