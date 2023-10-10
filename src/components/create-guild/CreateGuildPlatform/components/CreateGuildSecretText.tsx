import {
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
import Pagination from "components/create-guild/Pagination"
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
import { GuildFormType } from "types"

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
        <Pagination
          nextButtonDisabled={!name?.length || !text?.length}
          nextStepHandler={() => {
            append({
              platformName: "TEXT",
              platformGuildId: `text-${userId}-${Date.now()}`,
              platformGuildData: {
                text,
                name,
                imageUrl,
              },
            })
            setPlatform("DEFAULT")
          }}
        />
      </ModalFooter>
    </>
  )
}
export default CreateGuildSecretText
