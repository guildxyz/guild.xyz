import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import useEditGuildPlatform from "components/[guild]/AccessHub/hooks/useEditGuildPlatform"
import { ImportPoapForm } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPoapPanel/AddPoapPanel"
import UploadMintLinks from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPoapPanel/components/UploadMintLinks"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useToast from "hooks/useToast"
import { FormProvider, useForm, useWatch } from "react-hook-form"

type Props = {
  isOpen: boolean
  onClose: () => void
  guildPlatformId: number
}

const UploadMintLinksModal = ({ isOpen, onClose, guildPlatformId }: Props) => {
  const methods = useForm<ImportPoapForm>()
  const texts = useWatch({ name: "texts", control: methods.control })

  const toast = useToast()
  const { onSubmit, isLoading } = useEditGuildPlatform({
    guildPlatformId,
    onSuccess: () => {
      toast({
        status: "success",
        title: "Successfully uploaded mint links",
      })
      onClose()
    },
  })

  const onEditPoapRewardSubmit = (data: ImportPoapForm) =>
    onSubmit({
      platformGuildData: {
        texts: data.texts?.filter(Boolean),
      },
    })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <FormProvider {...methods}>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Upload POAP mint links</ModalHeader>
          <ModalBody>
            <UploadMintLinks />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="indigo"
              isDisabled={!texts?.length}
              w="max-content"
              ml="auto"
              onClick={methods.handleSubmit(onEditPoapRewardSubmit)}
              isLoading={isLoading}
              loadingText="Saving reward"
            >
              Upload links
            </Button>
          </ModalFooter>
        </ModalContent>
      </FormProvider>
    </Modal>
  )
}
export default UploadMintLinksModal
