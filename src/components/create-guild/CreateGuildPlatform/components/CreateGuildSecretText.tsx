import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
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
import CreatePlatformModalWrapper from "./CreatePlatformModalWrapper"

const CreateGuildSecretText = () => {
  const { id: userId } = useUser()

  const { setPlatform } = useCreateGuildContext()

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
    <CreatePlatformModalWrapper size="3xl">
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
                imageUrl,
              },
            })
            setPlatform(null)
          }}
        >
          Add
        </Button>
      </ModalFooter>
    </CreatePlatformModalWrapper>
  )
}
export default CreateGuildSecretText
