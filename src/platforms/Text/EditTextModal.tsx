import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import useEditGuildPlatform from "components/[guild]/AccessHub/hooks/useEditGuildPlatform"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useToast from "hooks/useToast"
import { FormProvider, useForm } from "react-hook-form"
import { GuildPlatform } from "types"
import TextDataForm, { TextRewardForm } from "./TextDataForm"

type Props = {
  isOpen: boolean
  onClose: () => void
  guildPlatformId: number
  platformGuildData: GuildPlatform["platformGuildData"]
}

const EditTextModal = ({
  isOpen,
  onClose,
  guildPlatformId,
  platformGuildData,
}: Props) => {
  const { name, imageUrl, text } = platformGuildData

  const methods = useForm<TextRewardForm>({
    mode: "all",
    defaultValues: {
      name,
      imageUrl,
      text,
    },
  })

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

  const onEditTextRewardSubmit = (data: TextRewardForm) =>
    onSubmit({ platformGuildData: data })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit secret</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormProvider {...methods}>
            <TextDataForm>
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
            </TextDataForm>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
export default EditTextModal
