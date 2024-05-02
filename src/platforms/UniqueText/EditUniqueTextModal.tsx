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
import UniqueTextDataForm, { UniqueTextRewardForm } from "./UniqueTextDataForm"

type Props = {
  isOpen: boolean
  onClose: () => void
  guildPlatformId: number
  platformGuildData: GuildPlatform["platformGuildData"]
}

const EditUniqueTextModal = ({
  isOpen,
  onClose,
  guildPlatformId,
  platformGuildData,
}: Props) => {
  const { name, imageUrl } = platformGuildData

  const methods = useForm<UniqueTextRewardForm>({
    mode: "all",
    defaultValues: {
      name,
      imageUrl,
    },
  })
  const { handleSubmit } = methods

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

  const onEditTextRewardSubmit = (data: UniqueTextRewardForm) =>
    onSubmit({ platformGuildData: { ...data, texts: data.texts?.filter(Boolean) } })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit reward</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormProvider {...methods}>
            <UniqueTextDataForm isEditForm>
              <Button
                colorScheme="indigo"
                isDisabled={!name?.length}
                w="max-content"
                ml="auto"
                onClick={handleSubmit(onEditTextRewardSubmit)}
                isLoading={isLoading}
                loadingText="Saving reward"
              >
                Save
              </Button>
            </UniqueTextDataForm>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
export default EditUniqueTextModal
