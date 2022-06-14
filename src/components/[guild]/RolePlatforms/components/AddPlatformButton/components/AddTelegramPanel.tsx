import { Button, HStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import TelegramGroup from "components/create-guild/TelegramGroup"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"

type Props = {
  onClose: () => void
}

const AddTelegramPanel = ({ onClose }: Props) => {
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
      <Card p={10}>
        <TelegramGroup cols={2} />
        <HStack justifyContent={"end"} mt={5}>
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
        </HStack>
      </Card>
    </FormProvider>
  )
}

export default AddTelegramPanel
