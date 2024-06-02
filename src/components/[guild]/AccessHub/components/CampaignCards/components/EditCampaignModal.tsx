import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import CampaignForm, {
  CampaignFormType,
} from "components/[guild]/CreateCampaignModal/components/CampaignForm"
import useRoleGroup from "components/[guild]/hooks/useRoleGroup"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import { FormProvider, useForm } from "react-hook-form"
import useEditRoleGroup from "../hooks/useEditRoleGroup"

type Props = {
  isOpen: boolean
  onClose: () => void
  groupId: number
  onSuccess: () => void
}

const EditCampaignModal = ({ groupId, onSuccess, ...modalProps }: Props) => {
  const group = useRoleGroup(groupId)
  const { name, imageUrl, description } = group ?? {}

  const methods = useForm<CampaignFormType>({
    mode: "all",
    defaultValues: {
      name,
      imageUrl: imageUrl ?? "",
      description: description ?? "",
    },
  })
  const { handleSubmit } = methods

  const iconUploader = usePinata({
    fieldToSetOnSuccess: "imageUrl",
    control: methods.control,
  })

  const { onSubmit, isLoading } = useEditRoleGroup(groupId, onSuccess)

  const { handleSubmit: handleSubmitWithUpload, isUploadingShown } =
    useSubmitWithUpload(handleSubmit(onSubmit), iconUploader.isUploading)

  return (
    <FormProvider {...methods}>
      <Modal {...modalProps} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit page</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <CampaignForm iconUploader={iconUploader} />
          </ModalBody>

          <ModalFooter pt={0}>
            <Button
              colorScheme="green"
              h={10}
              variant="solid"
              onClick={handleSubmitWithUpload}
              isLoading={isUploadingShown || isLoading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormProvider>
  )
}
export default EditCampaignModal
