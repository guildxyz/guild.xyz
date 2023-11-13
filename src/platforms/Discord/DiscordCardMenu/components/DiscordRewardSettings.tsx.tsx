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
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { GuildPlatform, PlatformGuildData } from "types"
import fetcher from "utils/fetcher"

type DCPlatformGuildData = PlatformGuildData["DISCORD"]

const DiscordRewardSettings = ({ isOpen, onClose, serverId }) => {
  const { id, guildPlatforms, mutateGuild } = useGuild()
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const guildPlatform = guildPlatforms.find(
    (platform) => platform.platformGuildId === serverId
  )

  const submit = (signedValidation: SignedValdation) =>
    fetcher(`/v2/guilds/${id}/guild-platforms/${guildPlatform.id}`, {
      method: "PUT",
      ...signedValidation,
    })

  const { onSubmit, isLoading } = useSubmitWithSign<GuildPlatform>(submit, {
    onSuccess: (response) => {
      toast({
        status: "success",
        title: "Successfully updated invite link",
      })
      methods.reset(undefined, { keepValues: true })
      mutateGuild(
        (prev) => ({
          ...prev,
          guildPlatforms: prev.guildPlatforms.map((gp) => {
            if (gp.id !== response.id) return gp

            return {
              ...gp,
              platformGuildData: {
                ...gp.platformGuildData,
                invite: (response.platformGuildData as DCPlatformGuildData).invite,
              } as DCPlatformGuildData,
            }
          }),
        }),
        { revalidate: false }
      )
      onClose()
    },
    onError: (err) => showErrorToast(err),
  })

  const defaultValues = {
    platformGuildData: {
      ...guildPlatform.platformGuildData,
      invite: guildPlatform.invite,
    },
    platformGuildId: guildPlatform.platformGuildId,
  }

  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
  })

  const handleClose = () => {
    if (methods.formState.isDirty) methods.reset(defaultValues)
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
                name={`platformGuildData.invite`}
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
            onClick={methods.handleSubmit(onSubmit)}
            isLoading={isLoading}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DiscordRewardSettings
