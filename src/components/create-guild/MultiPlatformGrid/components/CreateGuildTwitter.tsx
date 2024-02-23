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
import TwitterUrlInput from "components/create-guild/BasicInfo/components/TwitterUrlInput"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CreateGuildTwitter = ({ isOpen, onClose }: Props) => {
  const methods = useFormContext<GuildFormType>()
  const methodsTwitter = useForm<{ twitterUrl: string }>({ mode: "all" })

  const link = useWatch({
    control: methodsTwitter.control,
    name: "twitterUrl",
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      colorScheme="dark"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add X link</ModalHeader>
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

export default CreateGuildTwitter
