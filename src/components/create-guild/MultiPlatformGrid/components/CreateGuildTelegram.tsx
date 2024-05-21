import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import TelegramGroup from "components/create-guild/TelegramGroup"
import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import { modalSizeForPlatform } from "platforms/rewards"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { GuildFormType, PlatformType } from "types"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CreateGuildTelegram = ({ isOpen, onClose }: Props): JSX.Element => {
  const methods = useFormContext<GuildFormType>()
  const telegramMethods = useForm({
    defaultValues: { telegramGroupId: "", name: "", imageUrl: undefined },
  })
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      colorScheme="dark"
      size={modalSizeForPlatform("TELEGRAM")}
    >
      <ModalOverlay />
      <ModalContent>
        {" "}
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
              onClose()
            }}
          >
            Add
          </Button>
        </ModalFooter>
        <DynamicDevTool control={methods.control} />
      </ModalContent>
    </Modal>
  )
}

export default CreateGuildTelegram
