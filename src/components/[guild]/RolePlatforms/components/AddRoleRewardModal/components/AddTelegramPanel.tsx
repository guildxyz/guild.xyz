import Button from "components/common/Button"
import TelegramGroup from "components/create-guild/TelegramGroup"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"

type Props = {
  showRoleSelect: () => void
}

const AddTelegramPanel = ({ showRoleSelect }: Props) => {
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
            })
            showRoleSelect()
          }}
        >
          Add Telegram
        </Button>
      </TelegramGroup>
    </FormProvider>
  )
}

export default AddTelegramPanel
