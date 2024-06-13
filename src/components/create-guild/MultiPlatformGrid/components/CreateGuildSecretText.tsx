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
import useUser from "components/[guild]/hooks/useUser"
import SecretTextDataForm, {
  SecretTextRewardForm,
} from "platforms/SecretText/SecretTextDataForm"
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

const CreateGuildSecretText = ({ isOpen, onClose }: Props) => {
  const { id: userId } = useUser()

  const { control } = useFormContext<GuildFormType>()
  const { append } = useFieldArray({
    control,
    name: "guildPlatforms",
  })

  const methods = useForm<SecretTextRewardForm>({ mode: "all" })

  const name = useWatch({ control: methods.control, name: "name" })
  const text = useWatch({ control: methods.control, name: "text" })
  const imageUrl = useWatch({ control: methods.control, name: "imageUrl" })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      colorScheme="dark"
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent>
        {" "}
        <ModalHeader>Add Secret</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...methods}>
            <SecretTextDataForm />
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            isDisabled={!name?.length || !text?.length}
            onClick={() => {
              append({
                platformName: "TEXT",
                platformGuildId: `text-${userId}-${Date.now()}`,
                platformId: PlatformType.TEXT,
                platformGuildData: {
                  text,
                  name,
                  // @ts-expect-error TODO: fix this error originating from strictNullChecks
                  imageUrl,
                },
              })
              onClose()
            }}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default CreateGuildSecretText
