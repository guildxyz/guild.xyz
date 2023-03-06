import Button from "components/common/Button"
import TelegramGroup from "components/create-guild/TelegramGroup"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { Visibility } from "types"

type Props = {
  onSuccess: () => void
}

const AddTelegramPanel = ({ onSuccess }: Props) => {
  const methods = useForm({
    mode: "all",
    defaultValues: {
      platformGuildId: null,
    },
  })

  const platformGuildId = useWatch({
    name: "platformGuildId",
    control: methods.control,
  })

  const roleVisibility: Visibility = useWatch({ name: ".visibility" })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  return (
    <FormProvider {...methods}>
      <TelegramGroup fieldName={`platformGuildId`}>
        <Button
          colorScheme={"green"}
          onClick={() => {
            append({
              guildPlatform: {
                platformName: "TELEGRAM",
                platformGuildId,
              },
              isNew: true,
              visibility: roleVisibility,
            })
            onSuccess()
          }}
        >
          Add Telegram
        </Button>
      </TelegramGroup>
    </FormProvider>
  )
}

export default AddTelegramPanel
