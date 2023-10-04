import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useEditGuildPlatform from "components/[guild]/AccessHub/hooks/useEditGuildPlatform"
import useToast from "hooks/useToast"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { GuildPlatform } from "types"
import SecretTextDataForm, {
  SecretTextRewardForm,
} from "./SecretTextDataForm/SecretTextDataForm"

type Props = {
  isOpen: boolean
  onClose: () => void
  guildPlatformId: number
  platformGuildData: GuildPlatform["platformGuildData"]
}

const EditSecretTextModal = ({
  isOpen,
  onClose,
  guildPlatformId,
  platformGuildData,
}: Props) => {
  const { name, imageUrl, text } = platformGuildData

  const methods = useForm<SecretTextRewardForm>({
    mode: "all",
  })

  // `defaultValues` didn't work properly in useForm, so we're just resetting the form on mount instead
  useEffect(() => methods.reset({ name, imageUrl, text }), [])

  const toast = useToast()
  const { onSubmit, isLoading } = useEditGuildPlatform({
    guildPlatformId,
    onSuccess: () => {
      toast({
        status: "success",
        title: "Successfully updated reward",
      })
      onClose()
    },
  })

  const onEditTextRewardSubmit = (data: SecretTextRewardForm) =>
    onSubmit({ platformGuildData: data })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit secret</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormProvider {...methods}>
            <SecretTextDataForm>
              <Button
                colorScheme="indigo"
                isDisabled={!name?.length || !text?.length}
                w="max-content"
                ml="auto"
                onClick={methods.handleSubmit(onEditTextRewardSubmit)}
                isLoading={isLoading}
                loadingText="Saving reward"
              >
                Save
              </Button>
            </SecretTextDataForm>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
export default EditSecretTextModal
