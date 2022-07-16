import { Button } from "@chakra-ui/react"
import TelegramGroup from "components/create-guild/TelegramGroup"
import useGuild from "components/[guild]/hooks/useGuild"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"

type Props = {
  onClose: () => void
}

const AddTelegramPanel = ({ onClose }: Props) => {
  const { guildPlatforms } = useGuild()

  const methods = useForm({
    mode: "all",
    defaultValues: {
      platform: "TELEGRAM",
      TELEGRAM: {
        platformId: "",
      },
    },
  })

  const platformId = useWatch({
    name: "TELEGRAM.platformId",
    control: methods.control,
  })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  return (
    <FormProvider {...methods}>
      <TelegramGroup
        fieldName={`guildPlatforms.${guildPlatforms?.length}.platformGuildId`}
      >
        <Button
          colorScheme={"green"}
          onClick={() => {
            append({
              platformId,
              type: "TELEGRAM",
            })
            onClose()
          }}
        >
          Add Telegram
        </Button>
      </TelegramGroup>
    </FormProvider>
  )
}

export default AddTelegramPanel
