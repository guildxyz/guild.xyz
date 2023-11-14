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
import CreatePlatformModalWrapper from "./CreatePlatformModalWrapper"

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
    <CreatePlatformModalWrapper size="3xl">
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
                name: groupName,
                imageUrl: groupIcon,
              } as any, // TODO for later: define the PlatformGuildData types properly,
            })
            setPlatform(null)
          }}
        >
          Add
        </Button>
      </ModalFooter>

      <DynamicDevTool control={methods.control} />
    </CreatePlatformModalWrapper>
  )
}

export default CreateGuildTelegram
