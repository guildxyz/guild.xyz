import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react"
import useEditGuildPlatform from "components/[guild]/AccessHub/hooks/useEditGuildPlatform"
import { AddPointsFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/AddPointsPanel"
import AddNewPointsType from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/AddNewPointsType"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useToast from "hooks/useToast"
import { useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { GuildPlatform } from "types"

type Props = {
  isOpen: boolean
  onClose: () => void
  guildPlatformId: number
  platformGuildData: GuildPlatform["platformGuildData"]
}

const EditPointsModal = ({
  isOpen,
  onClose,
  guildPlatformId,
  platformGuildData,
}: Props) => {
  const { name: currentName, imageUrl: currentImage } = platformGuildData

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

  const onEditPointsRewardSubmit = (data) => {
    onSubmit({ platformGuildData: data })
  }

  const methods = useForm<AddPointsFormType>({
    mode: "all",
    defaultValues: {
      name: currentName,
      imageUrl: currentImage,
    },
  })

  const { control } = methods
  const localName = useWatch({ control, name: "name" })
  const localImage = useWatch({ control, name: "imageUrl" })

  useEffect(() => {
    isOpen && methods.reset({ name: currentName, imageUrl: imageUrl })
  }, [isOpen])

  const name = localName ?? currentName
  const imageUrl = localImage ?? currentImage

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit points</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...methods}>
            <Stack spacing={8}>
              <AddNewPointsType
                name={name}
                imageUrl={imageUrl}
                isOptional={false}
              ></AddNewPointsType>

              <Button
                colorScheme="indigo"
                isDisabled={!name?.length}
                w="max-content"
                ml="auto"
                onClick={methods.handleSubmit(onEditPointsRewardSubmit)}
                isLoading={isLoading}
                loadingText="Saving reward"
              >
                Save
              </Button>
            </Stack>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditPointsModal
