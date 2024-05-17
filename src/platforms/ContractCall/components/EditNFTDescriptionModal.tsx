import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react"
import useEditGuildPlatform from "components/[guild]/AccessHub/hooks/useEditGuildPlatform"
import RichTextDescriptionEditor from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/components/RichTextDescriptionEditor"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useToast from "hooks/useToast"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { GuildPlatform } from "types"

type ContentProps = {
  guildPlatform: GuildPlatform
  onClose: () => void
}

const EditNFTModalContent: React.FC<ContentProps> = ({
  guildPlatform: { id, platformGuildData },
  onClose,
}) => {
  const { formState, control, handleSubmit } = useForm<{ description: string }>({
    defaultValues: { description: platformGuildData.description },
  })

  const toast = useToast()

  const { onSubmit, isLoading } = useEditGuildPlatform({
    guildPlatformId: id,
    onSuccess: () => {
      toast({
        status: "success",
        title: "Successfully updated NFT description",
      })
      onClose()
    },
  })

  return (
    <>
      <ModalCloseButton />
      <ModalHeader>{platformGuildData.name} NFT</ModalHeader>
      <ModalBody pt={0}>
        <FormControl isInvalid={!!formState.errors?.description}>
          <FormLabel>NFT description</FormLabel>
          <Controller
            name="description"
            control={control}
            rules={{ required: { value: true, message: "This field is required" } }}
            render={({ field }) => (
              <RichTextDescriptionEditor
                minHeight="100px"
                defaultValue={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <FormErrorMessage>
            {formState.errors?.description?.message}
          </FormErrorMessage>
        </FormControl>
      </ModalBody>
      <ModalFooter pt={0}>
        <Button
          colorScheme="green"
          isDisabled={!formState.isDirty || !formState.isValid}
          onClick={handleSubmit((data) => onSubmit({ platformGuildData: data }))}
          isLoading={isLoading}
        >
          Save
        </Button>
      </ModalFooter>
    </>
  )
}

type Props = {
  guildPlatform: GuildPlatform
} & Omit<ModalProps, "children">

// Modal was separated for not load the forms logic
const EditNFTDescriptionModal: React.FC<Props> = ({
  guildPlatform,
  isOpen,
  onClose,
}: Props) => (
  <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
    <ModalOverlay />
    <ModalContent>
      <EditNFTModalContent guildPlatform={guildPlatform} onClose={onClose} />
    </ModalContent>
  </Modal>
)

export default EditNFTDescriptionModal
