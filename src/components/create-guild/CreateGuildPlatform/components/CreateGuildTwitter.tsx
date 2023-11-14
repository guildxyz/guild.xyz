import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import TwitterUrlInput from "components/create-guild/BasicInfo/components/TwitterUrlInput"
import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import CreatePlatformModalWrapper from "./CreatePlatformModalWrapper"

const CreateGuildTwitter = () => {
  const { setPlatform } = useCreateGuildContext()
  const methods = useFormContext<GuildFormType>()
  const methodsTwitter = useForm<{ twitterUrl: string }>({ mode: "all" })

  const link = useWatch({
    control: methodsTwitter.control,
    name: "twitterUrl",
  })

  return (
    <CreatePlatformModalWrapper>
      <ModalHeader>Add twitter link</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormProvider {...methodsTwitter}>
          <TwitterUrlInput />
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="green"
          isDisabled={!link || !!methodsTwitter.formState.errors.twitterUrl}
          onClick={() => {
            methods.setValue("socialLinks.TWITTER", link)
            setPlatform(null)
          }}
        >
          Add
        </Button>
      </ModalFooter>
    </CreatePlatformModalWrapper>
  )
}

export default CreateGuildTwitter
