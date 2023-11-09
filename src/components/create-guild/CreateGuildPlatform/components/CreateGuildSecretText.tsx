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
    <>
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
            setPlatform("DEFAULT")
          }}
        >
          Add{/*nextStepText*/}
        </Button>
      </ModalFooter>
    </>
  )
}
export default CreateGuildSecretText
