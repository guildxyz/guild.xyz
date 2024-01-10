import React from "react"
import useToast from "../../../../../hooks/useToast"
import { Controller, useForm } from "react-hook-form"
import useEditGuildPlatform from "../../../AccessHub/hooks/useEditGuildPlatform"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import RichTextDescriptionEditor from "../../../RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/components/RichTextDescriptionEditor"
import Button from "../../../../common/Button"
import { GuildPlatform } from "../../../../../types"

type Props = {
  guildPlatform: GuildPlatform
  onClose: () => void
}

export const EditRewardModalContent: React.FC<Props> = ({
  guildPlatform: { id, platformGuildData },
  onClose,
}) => {
  const { formState, control, handleSubmit } = useForm({
    defaultValues: { ...platformGuildData },
  })

  const toast = useToast()

  const { onSubmit, isLoading } = useEditGuildPlatform({
    guildPlatformId: id,
    onSuccess: () => {
      toast({
        status: "success",
        title: "Successfully updated reward description",
      })
      onClose()
    },
  })

  return (
    <>
      <ModalCloseButton />
      <ModalHeader>{platformGuildData.name}</ModalHeader>
      <ModalBody>
        <FormControl isInvalid={!!formState.errors?.description}>
          <FormLabel>Reward description</FormLabel>
          <Controller
            name={"description"}
            control={control}
            rules={{ required: { value: true, message: "This field is required" } }}
            render={({ field }) => (
              <RichTextDescriptionEditor
                minHeight={"100px"}
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
      <ModalFooter>
        <Button
          colorScheme={"green"}
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
