import {
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import Pagination from "components/create-guild/Pagination"
import TelegramGroup from "components/create-guild/TelegramGroup"
import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import usePinata from "hooks/usePinata"
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

  const { onUpload } = usePinata({
    onSuccess: ({ IpfsHash }) => {
      methods.setValue(
        "imageUrl",
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`
      )
    },
  })

  const {
    data: { ok },
  } = useIsTGBotIn(guildPlatformId, { refreshInterval: 5000 })

  return (
    <>
      <ModalHeader>Add Telegram</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormProvider {...telegramMethods}>
          <TelegramGroup onUpload={onUpload} fieldName={"telegramGroupId"} />
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <Pagination
          nextButtonDisabled={!guildPlatformId || !ok}
          nextStepHandler={() => {
            append({
              platformName: "TELEGRAM",
              platformGuildId: telegramMethods.getValues("telegramGroupId"),
              platformId: PlatformType.TELEGRAM,
              platformGuildData: {
                text: undefined,
                name: telegramMethods.getValues("name"),
                imageUrl: telegramMethods.getValues("imageUrl"),
              },
            })
            setPlatform("DEFAULT")
          }}
        />
      </ModalFooter>

      <DynamicDevTool control={methods.control} />
    </>
  )
}

export default CreateGuildTelegram
