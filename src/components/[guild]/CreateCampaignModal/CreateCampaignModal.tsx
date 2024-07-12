import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import { ArrowRight } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import CampaignForm, { CampaignFormType } from "./components/CampaignForm"
import useCreateRoleGroup from "./hooks/useCreateRoleGroup"

type Props = { isOpen: boolean; onClose: () => void }

const CreateCampaignModal = (props: Props) => {
  const methods = useForm<CampaignFormType>({ mode: "all" })
  const { handleSubmit } = methods

  const iconUploader = usePinata({
    fieldToSetOnSuccess: "imageUrl",
    control: methods.control,
  })

  const { onSubmit, isLoading } = useCreateRoleGroup()

  const { handleSubmit: handleSubmitWithUpload, isUploadingShown } =
    useSubmitWithUpload(handleSubmit(onSubmit), iconUploader.isUploading)

  return (
    <FormProvider {...methods}>
      <Modal {...props} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create page</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <CampaignForm iconUploader={iconUploader} />
          </ModalBody>

          <ModalFooter pt={0}>
            <Button
              colorScheme="green"
              rightIcon={<ArrowRight />}
              onClick={handleSubmitWithUpload}
              isLoading={isUploadingShown || isLoading}
              loadingText="Creating page"
            >
              Create & set roles
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormProvider>
  )
}
export default CreateCampaignModal
