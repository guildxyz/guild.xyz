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
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"

const CreateGuildSecretText = () => {
  const { id: userId } = useUser()

  const { setPlatform, addConnectedPlatform } = useCreateGuildContext()

  const { setValue } = useFormContext<GuildFormType>()
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
            setValue("guildPlatforms.0", {
              platformName: "TEXT",
              platformGuildId: `text-${userId}-${Date.now()}`,
              platformGuildData: {
                text,
                name,
                imageUrl,
              },
            })
            console.log("xy text called")
            setPlatform("DEFAULT")
            addConnectedPlatform("TEXT")
          }}
        />
      </ModalFooter>
    </>
  )
}
export default CreateGuildSecretText
