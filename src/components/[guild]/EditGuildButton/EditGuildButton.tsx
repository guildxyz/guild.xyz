import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  DrawerProps,
  HStack,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import useGuild from "components/[guild]/hooks/useGuild"
import { useThemeContext } from "components/[guild]/ThemeContext"
import usePersonalSign from "hooks/usePersonalSign"
import useUploadPromise from "hooks/useUploadPromise"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { PencilSimple } from "phosphor-react"
import { useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import BackgroundImageUploader from "./components/BackgroundImageUploader"
import ColorModePicker from "./components/ColorModePicker"
import ColorPicker from "./components/ColorPicker"
import DeleteGuildButton from "./components/DeleteGuildButton"
import useEditGuild from "./hooks/useEditGuild"

const EditGuildButton = ({
  finalFocusRef,
}: Omit<DrawerProps, "children">): JSX.Element => {
  const { isSigning } = usePersonalSign()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const editBtnRef = useRef()
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })

  const { name, imageUrl, description, theme } = useGuild()
  const defaultValues = {
    name,
    imageUrl,
    description,
    theme: theme ?? {},
  }
  const methods = useForm({
    mode: "all",
    defaultValues,
  })

  const {
    handleSubmit,
    isUploading,
    setUploadPromise,
    shouldBeLoading,
    uploadPromise,
  } = useUploadPromise(methods.handleSubmit)

  const onSuccess = () => {
    onClose()
    methods.reset(undefined, { keepValues: true })
    setUploadPromise(null)
  }

  const { onSubmit, isLoading } = useEditGuild(onSuccess)

  const {
    localThemeColor,
    setLocalThemeMode,
    localThemeMode,
    setLocalThemeColor,
    localBackgroundImage,
    setLocalBackgroundImage,
  } = useThemeContext()

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const onCloseAndClear = () => {
    const themeMode = theme?.mode
    const themeColor = theme?.color
    const backgroundImage = theme?.backgroundImage
    if (themeMode !== localThemeMode) setLocalThemeMode(themeMode)
    if (themeColor !== localThemeColor) setLocalThemeColor(themeColor)
    if (backgroundImage !== localBackgroundImage)
      setLocalBackgroundImage(backgroundImage)
    setUploadPromise(null)
    methods.reset()
    onAlertClose()
    onClose()
  }

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isUploading) return "Uploading image"
    return "Saving data"
  }

  const isDirty = methods.formState.isDirty || uploadPromise

  return (
    <>
      <IconButton
        ref={editBtnRef}
        aria-label="Edit & customize guild"
        minW={"44px"}
        rounded="full"
        colorScheme="alpha"
        onClick={onOpen}
        data-dd-action-name="Edit guild"
        icon={<PencilSimple />}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        size={drawerSize}
        onClose={isDirty ? onAlertOpen : onClose}
        finalFocusRef={finalFocusRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody className="custom-scrollbar">
            <DrawerHeader title="Edit guild">
              <DeleteGuildButton />
            </DrawerHeader>
            <FormProvider {...methods}>
              <VStack spacing={10} alignItems="start">
                <Section title="Choose a logo and name for your guild">
                  <HStack spacing={2} alignItems="start">
                    <IconSelector setUploadPromise={setUploadPromise} />
                    <Name />
                  </HStack>
                </Section>

                <Section title="Guild description">
                  <Description />
                </Section>
                <Section title="Customize appearance">
                  <ColorPicker label="Main color" fieldName="theme.color" />
                  <ColorModePicker label="Color mode" fieldName="theme.mode" />
                  <BackgroundImageUploader setUploadPromise={setUploadPromise} />
                </Section>
              </VStack>
              {/* <VStack alignItems="start" spacing={4} width="full"></VStack> */}
            </FormProvider>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onCloseAndClear}>
              Cancel
            </Button>
            <Button
              disabled={!isDirty || isLoading || isSigning || shouldBeLoading}
              isLoading={isLoading || isSigning || shouldBeLoading}
              colorScheme="green"
              loadingText={loadingText()}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
        <DynamicDevTool control={methods.control} />
      </Drawer>

      <DiscardAlert
        {...{
          isOpen: isAlertOpen,
          onClose: onAlertClose,
          onDiscard: onCloseAndClear,
        }}
      />
    </>
  )
}

export default EditGuildButton
