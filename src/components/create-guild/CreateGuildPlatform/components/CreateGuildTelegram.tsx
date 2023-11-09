import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import TelegramGroup from "components/create-guild/TelegramGroup"
import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { GuildFormType, PlatformType } from "types"

const CreateGuildTelegram = (): JSX.Element => {
  const methods = useFormContext<GuildFormType>()
  const telegramMethods = useForm({
    defaultValues: { telegramGroupId: "", name: "", imageUrl: undefined },
  })
  const { setPlatform } = useCreateGuildContext()
  const { append } = useFieldArray({
    control: methods.control,
    name: "guildPlatforms",
  })

  const guildPlatformId = useWatch({
    control: telegramMethods.control,
    name: "telegramGroupId",
  })

  const {
    data: { ok, groupName, groupIcon },
  } = useIsTGBotIn(guildPlatformId, { refreshInterval: 5000 })

  return (
    <>
      <ModalHeader>Add Telegram</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormProvider {...telegramMethods}>
          <TelegramGroup fieldName={"telegramGroupId"} />
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="green"
          isDisabled={!guildPlatformId || !ok}
          onClick={() => {
            append({
              platformName: "TELEGRAM",
              platformGuildId: telegramMethods.getValues("telegramGroupId"),
              platformId: PlatformType.TELEGRAM,
              platformGuildData: {
                text: undefined,
                name: groupName,
                imageUrl: groupIcon,
              },
            })
            setPlatform("DEFAULT")
          }}
        >
          Add{/*nextStepText*/}
        </Button>
      </ModalFooter>

      <DynamicDevTool control={methods.control} />
    </>
  )
}

export default CreateGuildTelegram
