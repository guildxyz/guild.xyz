import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useEditGuild from "components/[guild]/EditGuild/hooks/useEditGuild"
import useGuild from "components/[guild]/hooks/useGuild"
import useToast from "hooks/useToast"
import { Controller, FormProvider, useForm } from "react-hook-form"

const DiscordRewardSettings = ({ isOpen, onClose, serverId }) => {
  const { guildPlatforms } = useGuild()

  const guildPlatform = guildPlatforms.find(
    (platform) => platform.platformGuildId === serverId
  )

  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      guildPlatforms: [
        {
          id: guildPlatform.id,
          platformGuildData: {
            invite: guildPlatform.invite,
          },
        },
      ],
    },
  })

  const toast = useToast()
  const { onSubmit, isLoading } = useEditGuild({
    onSuccess: () => {
      toast({
        status: "success",
        title: "Successfully updated invite link",
      })
      methods.reset(undefined, { keepValues: true })
    },
  })

  const handleClose = () => {
    methods.reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent maxW="lg">
        <ModalHeader>{`Discord reward settings: ${guildPlatform.platformGuildName}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...methods}>
            <FormControl>
              <FormLabel>Go to server link</FormLabel>
              <Controller
                name={`guildPlatforms.0.platformGuildData.invite`}
                control={methods.control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    type="text"
                    ref={ref}
                    value={value ?? ""}
                    placeholder="Paste invite link"
                    onChange={(newChange) => {
                      onChange(newChange.target.value)
                    }}
                    onBlur={onBlur}
                  />
                )}
              />
              <FormHelperText>
                Use your custom invite link instead of the default generated one
              </FormHelperText>
            </FormControl>
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            onClick={methods.handleSubmit((data) => onSubmit(data))}
            isLoading={isLoading}
            isDisabled={!methods.formState.isDirty}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DiscordRewardSettings
