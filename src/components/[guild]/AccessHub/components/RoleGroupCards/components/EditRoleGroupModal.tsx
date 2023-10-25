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
import RoleGroupForm, {
  RoleGroupFormType,
} from "components/[guild]/CreateRoleGroupModal/components/RoleGroupForm"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import { useFormContext } from "react-hook-form"
import { Group } from "types"
import useEditRoleGroup from "../hooks/useEditRoleGroup"

type Props = {
  isOpen: boolean
  onClose: () => void
  groupId: number
  onSuccess: (response: Group) => void
}

const EditRoleGroupModal = ({ groupId, onSuccess, ...modalProps }: Props) => {
  const { setValue, handleSubmit } = useFormContext<RoleGroupFormType>()

  const iconUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`, {
        shouldTouch: true,
      })
    },
  })

  const { onSubmit, isLoading } = useEditRoleGroup(groupId, onSuccess)

  const { handleSubmit: handleSubmitWithUpload } = useSubmitWithUpload(
    handleSubmit(onSubmit),
    iconUploader.isUploading
  )

  return (
    <Modal {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit campaign</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <RoleGroupForm iconUploader={iconUploader} />
        </ModalBody>

        <ModalFooter pt={0}>
          <Button
            colorScheme="green"
            h={10}
            variant="solid"
            onClick={handleSubmitWithUpload}
            isLoading={isLoading}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default EditRoleGroupModal
