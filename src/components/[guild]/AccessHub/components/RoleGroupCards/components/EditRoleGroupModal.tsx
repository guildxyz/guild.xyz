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
import useGroup from "components/[guild]/hooks/useGroup"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import { FormProvider, useForm } from "react-hook-form"
import { Group } from "types"
import useEditRoleGroup from "../hooks/useEditRoleGroup"

type Props = {
  isOpen: boolean
  onClose: () => void
  groupId: number
  onSuccess: (response: Group) => void
}

const EditRoleGroupModal = ({ groupId, onSuccess, ...modalProps }: Props) => {
  const group = useGroup(groupId)
  const { name, imageUrl, description } = group ?? {}

  const methods = useForm<RoleGroupFormType>({
    mode: "all",
    defaultValues: {
      name,
      imageUrl: imageUrl ?? "",
      description: description ?? "",
    },
  })
  const { setValue, handleSubmit } = methods

  const iconUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`, {
        shouldTouch: true,
      })
    },
  })

  const { onSubmit, isLoading } = useEditRoleGroup(groupId, onSuccess)

  const { handleSubmit: handleSubmitWithUpload, isUploadingShown } =
    useSubmitWithUpload(handleSubmit(onSubmit), iconUploader.isUploading)

  return (
    <FormProvider {...methods}>
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
export default EditRoleGroupModal
