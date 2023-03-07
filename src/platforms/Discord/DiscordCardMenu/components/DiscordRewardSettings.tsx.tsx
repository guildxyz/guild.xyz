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
  Stack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import Switch from "components/common/Switch"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import fetcher from "utils/fetcher"

const DiscordRewardSettings = ({ isOpen, onClose, serverId }) => {
  const { id, guildPlatforms, mutateGuild } = useGuild()
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const guildPlatform = guildPlatforms.find(
    (platform) => platform.platformGuildId === serverId
  )

  const submit = (signedValidation: SignedValdation) =>
    fetcher(`/guild/${id}/platform/${guildPlatform.id}`, {
      method: "PATCH",
      ...signedValidation,
    })

  const { onSubmit, isLoading } = useSubmitWithSign(submit, {
    onSuccess: () => {
      toast({
        status: "success",
        title: "Successfully updated Discord settings",
      })
      methods.reset(undefined, { keepValues: true })
      mutateGuild()
      onClose()
    },
    onError: (err) => showErrorToast(err),
  })

  const defaultValues = {
    platformGuildData: {
      ...guildPlatform.platformGuildData,
      invite: guildPlatform.invite,
    },
  }

  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
  })

  const needCaptcha = useWatch({
    control: methods.control,
    name: "platformGuildData.needCaptcha",
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
            <Stack spacing={6}>
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

              <FormControl>
                <FormLabel>Discord CAPTCHA</FormLabel>

                <Switch
                  title={needCaptcha ? "Enabled" : "Disabled"}
                  {...methods.register("platformGuildData.needCaptcha")}
                />

                <FormHelperText>
                  If enabled, users will need to complete a CAPTCHA before joining
                  your guild on Discord
                </FormHelperText>
              </FormControl>
            </Stack>
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
