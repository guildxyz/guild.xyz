import {
  Button,
  MenuItem,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import Modal from "components/common/Modal"
import useGuild from "components/[guild]/hooks/useGuild"
import { useThemeContext } from "components/[guild]/ThemeContext"
import usePersonalSign from "hooks/usePersonalSign"
import { PaintBrush } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import BackgroundImageUploader from "./components/BackgroundImageUploader"
import ColorModePicker from "./components/ColorModePicker"
import ColorPicker from "./components/ColorPicker"
import useEdit from "./hooks/useEdit"

const CustomizationButton = (): JSX.Element => {
  const guild = useGuild()

  const methods = useForm({
    mode: "all",
    defaultValues: {
      theme: {
        color: guild?.theme?.[0]?.color,
        mode: guild?.theme?.[0]?.mode,
      },
      backgroundImage: null,
    },
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
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
    const themeMode = guild.theme?.[0]?.mode
    const themeColor = guild.theme?.[0]?.color
    const backgroundImage = guild.theme?.[0]?.backgroundImage
    if (themeMode !== localThemeMode) setLocalThemeMode(themeMode)
    if (themeColor !== localThemeColor) setLocalThemeColor(themeColor)
    if (backgroundImage !== localBackgroundImage) {
      setLocalBackgroundImage(backgroundImage)
      methods.setValue("backgroundImage", null)
    }
    onClose()
  }

  return (
    <>
      <MenuItem py="2" cursor="pointer" icon={<PaintBrush />} onClick={onOpen}>
        Change appearance
      </MenuItem>

      <Modal {...{ isOpen, onClose: onCloseHandler }}>
        <ModalOverlay>
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
                  isDisabled={
                    !methods.formState.isDirty || isLoading || isImageLoading
                  }
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
        </ModalOverlay>
      </Modal>
    </>
  )
}

export default CustomizationButton
