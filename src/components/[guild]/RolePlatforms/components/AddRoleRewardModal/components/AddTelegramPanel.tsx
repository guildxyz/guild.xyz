import Button from "components/common/Button"
import TelegramGroup from "components/create-guild/TelegramGroup"
import { AddPlatformPanelProps } from "platforms/rewards"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformType } from "types"

const AddTelegramPanel = ({ onAdd }: AddPlatformPanelProps) => {
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

  return (
    <FormProvider {...methods}>
      <TelegramGroup fieldName={`platformGuildId`}>
        <Button
          colorScheme={"green"}
          onClick={() =>
            onAdd({
              guildPlatform: {
                platformName: "TELEGRAM",
                platformId: PlatformType.TELEGRAM,
                platformGuildId,
              },
              isNew: true,
            })
          }
        >
          Add Telegram
        </Button>
      </TelegramGroup>
    </FormProvider>
  )
}

export default AddTelegramPanel
