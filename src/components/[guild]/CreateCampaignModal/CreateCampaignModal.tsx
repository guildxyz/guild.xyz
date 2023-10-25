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
import { useFormContext } from "react-hook-form"
import CampaignForm, { CampaignFormType } from "./components/CampaignForm"
import useCreateRoleGroup from "./hooks/useCreateRoleGroup"

type Props = { isOpen: boolean; onClose: () => void }

const CreateCampaignModal = (props: Props) => {
  const { setValue, handleSubmit } = useFormContext<CampaignFormType>()

  const iconUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`, {
        shouldTouch: true,
      })
    },
  })

  const { onSubmit, isLoading } = useCreateRoleGroup()

  const { handleSubmit: handleSubmitWithUpload, uploadLoadingText } =
    useSubmitWithUpload(handleSubmit(onSubmit), iconUploader.isUploading)

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create campaign</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <CampaignForm iconUploader={iconUploader} />
        </ModalBody>

        <ModalFooter pt={0}>
          <Button
            colorScheme="green"
            rightIcon={<ArrowRight />}
            h={10}
            variant="solid"
            onClick={handleSubmitWithUpload}
            isLoading={iconUploader.isUploading || isLoading}
            loadingText={uploadLoadingText || "Creating campaign"}
          >
            Create & set roles
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default CreateCampaignModal
