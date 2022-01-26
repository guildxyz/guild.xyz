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
import { Modal } from "components/common/Modal"
import useGuild from "components/[guild]/hooks/useGuild"
import { useThemeContext } from "components/[guild]/ThemeContext"
import usePersonalSign from "hooks/usePersonalSign"
import { PaintBrush } from "phosphor-react"
import { useEffect, useState } from "react"
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
  const { onSubmit, isLoading } = useEdit(onClose)
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

  const [uploadPromise, setUploadPromise] = useState<Promise<void>>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!!uploadPromise) {
      setIsUploading(true)
      uploadPromise.finally(() => setIsUploading(false))
    }
  }, [uploadPromise, setIsUploading])

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isUploading) return "Uploading image"
    return "Saving"
  }

  return (
    <>
      <MenuItem py="2" cursor="pointer" icon={<PaintBrush />} onClick={onOpen}>
        Customize appearance
      </MenuItem>

      <Modal {...{ isOpen, onClose: onCloseHandler }}>
        <ModalOverlay />
        <ModalContent>
          <FormProvider {...methods}>
            <ModalHeader>Edit appearance</ModalHeader>

            <ModalBody>
              <VStack alignItems="start" spacing={4} width="full">
                <ColorPicker label="Main color" fieldName="theme.color" />
                <ColorModePicker label="Color mode" fieldName="theme.mode" />
                <BackgroundImageUploader setUploadPromise={setUploadPromise} />
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button onClick={onCloseHandler}>Cancel</Button>
              <Button
                isDisabled={
                  (!methods.formState.isDirty && uploadPromise === null) ||
                  isLoading ||
                  loading
                }
                colorScheme="primary"
                isLoading={isLoading || loading}
                loadingText={loadingText()}
                onClick={(event) => {
                  // handleSubmit just for validation here, so we don't go in "uploading images" state, and focus invalid fields after the loading
                  methods.handleSubmit(() => {
                    setLoading(true)
                    if (isUploading) {
                      uploadPromise
                        .catch(() => setLoading(false))
                        .then(() =>
                          methods.handleSubmit((data) => {
                            onSubmit(data)
                            setLoading(false)
                          })(event)
                        )
                    } else {
                      methods.handleSubmit((data) => {
                        onSubmit(data)
                        setLoading(false)
                      })(event)
                    }
                  })(event)
                }}
                ml={3}
              >
                Save
              </Button>
            </ModalFooter>
          </FormProvider>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CustomizationButton
