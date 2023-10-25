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
import RoleGroupForm, { RoleGroupFormType } from "./components/RoleGroupForm"
import useCreateRoleGroup from "./hooks/useCreateRoleGroup"

type Props = { isOpen: boolean; onClose: () => void }

const CreateRoleGroupModal = (props: Props) => {
  const { setValue, handleSubmit } = useFormContext<RoleGroupFormType>()

  const iconUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`, {
        shouldTouch: true,
      })
    },
  })

  const { onSubmit, isLoading } = useCreateRoleGroup()

  const { handleSubmit: handleSubmitWithUpload, isUploadingShown } =
    useSubmitWithUpload(handleSubmit(onSubmit), iconUploader.isUploading)

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create campaign</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <RoleGroupForm iconUploader={iconUploader} />
        </ModalBody>

        <ModalFooter pt={0}>
          <Button
            colorScheme="green"
            rightIcon={<ArrowRight />}
            h={10}
            variant="solid"
            onClick={handleSubmitWithUpload}
            isLoading={isUploadingShown || isLoading}
            loadingText="Creating campaign"
          >
            Create & set roles
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default CreateRoleGroupModal
