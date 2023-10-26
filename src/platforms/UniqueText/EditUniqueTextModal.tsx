import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useEditGuildPlatform from "components/[guild]/AccessHub/hooks/useEditGuildPlatform"
import useGuild from "components/[guild]/hooks/useGuild"
import useToast from "hooks/useToast"
import { useEffect, useState } from "react"
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
  const { isDetailed } = useGuild()
  const { name, imageUrl } = platformGuildData

  const methods = useForm<UniqueTextRewardForm>({
    mode: "all",
  })

  // TODO: find a cleaner, generalized solution for this, which will work for every reward in the future (Linear: GUILD-1391)
  const [initialSetup, setInitialSetup] = useState(true)
  useEffect(() => {
    if (!isDetailed) return
    if (!initialSetup) return
    setInitialSetup(false)
    // Intentionally leaving the `texts` field empty - admins can't edit texts which are already uploaded
    methods.reset({ name, imageUrl })
  }, [isDetailed])

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
                onClick={methods.handleSubmit(onEditTextRewardSubmit)}
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
