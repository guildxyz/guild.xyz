import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react"
import useEditGuildPlatform from "components/[guild]/AccessHub/hooks/useEditGuildPlatform"
import { AddGatherFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGatherPanel"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useToast from "hooks/useToast"
import { FormProvider, useForm } from "react-hook-form"
import { GuildPlatform } from "types"
import GatherForm from "./GatherForm"
import { getNameFromSpaceId } from "./useGatherCardProps"

type Props = {
  isOpen: boolean
  onClose: () => void
  guildPlatformId: number
  platformGuildData: GuildPlatform["platformGuildData"]
}

const EditGatherModal = ({
  isOpen,
  onClose,
  guildPlatformId,
  platformGuildData,
}: Props) => {
  const {
    gatherApiKey: currentApiKey,
    gatherAffiliation: currentAffiliation,
    gatherRole: currentRole,
    gatherSpaceId: currentSpaceId,
  } = platformGuildData

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

  const onEditGatherRewardSubmit = (data) => {
    data.name = getNameFromSpaceId(data?.gatherSpaceId)
    delete data?.gatherSpaceUrl
    onSubmit({ platformGuildData: data })
  }

  const spaceUrl = `https://app.gather.town/app/${currentSpaceId.replace("\\", "/")}`

  const methods = useForm<AddGatherFormType>({
    mode: "all",
    defaultValues: {
      gatherApiKey: currentApiKey,
      gatherSpaceUrl: spaceUrl,
      gatherSpaceId: currentSpaceId,
      gatherAffiliation: currentAffiliation,
      gatherRole: currentRole,
    },
  })

  const handleClose = () => {
    onClose()
    methods.reset({
      gatherApiKey: currentApiKey,
      gatherAffiliation: currentAffiliation,
      gatherRole: currentRole,
      gatherSpaceId: currentSpaceId,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Gather reward</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...methods}>
            <Stack>
              <GatherForm />

              <Button
                colorScheme="indigo"
                w="max-content"
                ml="auto"
                onClick={methods.handleSubmit(onEditGatherRewardSubmit)}
                isLoading={isLoading}
                loadingText="Saving reward"
                mt={8}
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

export default EditGatherModal
