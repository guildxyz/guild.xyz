import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useEdit from "components/[guild]/hooks/useEdit"
import useGuild from "components/[guild]/hooks/useGuild"
import { useThemeContext } from "components/[guild]/ThemeContext"
import usePersonalSign from "hooks/usePersonalSign"
import { FormProvider, useForm } from "react-hook-form"
import BackgroundImageUploader from "./components/BackgroundImageUploader"
import ColorModePicker from "./components/ColorModePicker"
import ColorPicker from "./components/ColorPicker"

const CustomizationButton = ({
  isOpen,
  onClose,
  finalFocusRef,
}: Omit<ModalProps, "children">): JSX.Element => {
  const guild = useGuild()

  const methods = useForm({
    mode: "all",
    defaultValues: {
      theme: {
        ...(guild?.theme ?? {}),
      },
    },
  })

  const { onSubmit, isLoading, isImageLoading } = useEdit(onClose)
  const { isSigning } = usePersonalSign()
  const {
    localThemeColor,
    setLocalThemeMode,
    localThemeMode,
    setLocalThemeColor,
    localBackgroundImage,
    setLocalBackgroundImage,
  } = useThemeContext()

  const onCloseHandler = () => {
    const themeMode = guild.theme?.mode
    const themeColor = guild.theme?.color
    const backgroundImage = guild.theme?.backgroundImage
    if (themeMode !== localThemeMode) setLocalThemeMode(themeMode)
    if (themeColor !== localThemeColor) setLocalThemeColor(themeColor)
    if (backgroundImage !== localBackgroundImage)
      setLocalBackgroundImage(backgroundImage)
    methods.reset()
    onClose()
  }

  return (
    <Modal {...{ isOpen, onClose: onCloseHandler, finalFocusRef }}>
      <ModalOverlay />
      <ModalContent>
        <FormProvider {...methods}>
          <ModalHeader>Edit appearance</ModalHeader>

          <ModalBody>
            <VStack alignItems="start" spacing={4} width="full">
              <ColorPicker label="Main color" fieldName="theme.color" />
              <ColorModePicker label="Color mode" fieldName="theme.mode" />
              <BackgroundImageUploader />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onCloseHandler}>Cancel</Button>
            <Button
              isDisabled={!methods.formState.isDirty || isLoading || isImageLoading}
              colorScheme="primary"
              isLoading={isLoading || isImageLoading}
              loadingText={
                isSigning
                  ? "Check your wallet"
                  : isImageLoading
                  ? "Uploading image"
                  : "Saving"
              }
              onClick={methods.handleSubmit(onSubmit)}
              ml={3}
            >
              Save
            </Button>
          </ModalFooter>
        </FormProvider>
      </ModalContent>
      <DynamicDevTool control={methods.control} />
    </Modal>
  )
}

export default CustomizationButton
