import {
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import TwitterUrlInput from "components/create-guild/BasicInfo/components/TwitterUrlInput"
import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
import Pagination from "components/create-guild/Pagination"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"

const CreateGuildTwitter = () => {
  const { setPlatform } = useCreateGuildContext()
  const methods = useFormContext<GuildFormType>()
  const methodsTwitter = useForm()

  const link = useWatch({
    control: methodsTwitter.control,
    name: "socialLinks.TWITTER",
  })

  return (
    <>
      <ModalHeader>Add twitter link</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormProvider {...methodsTwitter}>
          <TwitterUrlInput />
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <Pagination
          nextButtonDisabled={!link}
          nextStepHandler={() => {
            methods.setValue("socialLinks.TWITTER", link)
            setPlatform("DEFAULT")
          }}
        />
      </ModalFooter>
    </>
  )
}

export default CreateGuildTwitter
