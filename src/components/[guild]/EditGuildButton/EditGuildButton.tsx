import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  DrawerProps,
  HStack,
  IconButton,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
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
import MembersToggle from "components/[guild]/EditGuildButton/components/MembersToggle"
import useGuild from "components/[guild]/hooks/useGuild"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useLocalStorage from "hooks/useLocalStorage"
import useUploadPromise from "hooks/useUploadPromise"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { PencilSimple } from "phosphor-react"
import { useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import useGuildPermission from "../hooks/useGuildPermission"
import Admins from "./components/Admins"
import BackgroundImageUploader from "./components/BackgroundImageUploader"
import ColorModePicker from "./components/ColorModePicker"
import ColorPicker from "./components/ColorPicker"
import DeleteGuildButton from "./components/DeleteGuildButton"
import useEditGuild from "./hooks/useEditGuild"

const EditGuildButton = ({
  finalFocusRef,
}: Omit<DrawerProps, "children">): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const editBtnRef = useRef()
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })
  const { isOwner } = useGuildPermission()

  const { id, name, imageUrl, description, theme, showMembers, admins } = useGuild()
  const defaultValues = {
    name,
    imageUrl,
    description,
    theme: theme ?? {},
    showMembers,
    admins: admins?.flatMap((admin) => (admin.isOwner ? [] : admin.address)) ?? [],
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

  const { onSubmit, isLoading, isSigning } = useEditGuild(onSuccess)

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

  const [showOnboardingPopover, setShowOnboardingPopover] = useLocalStorage(
    `${id}_showOnboardingTooltip`,
    !theme.backgroundCss &&
      !theme.backgroundImage &&
      !theme.color &&
      theme.mode !== "LIGHT" /* && !description */
  )
  const closePopover = () => setShowOnboardingPopover(false)
  const handleOpen = () => {
    closePopover()
    onOpen()
  }

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

  const isDirty = methods?.formState?.isDirty || uploadPromise

  return (
    <>
      <Popover
        placement="left"
        isOpen={showOnboardingPopover}
        isLazy
        autoFocus={false}
        arrowSize={10}
      >
        <PopoverContent
          maxW="270"
          bgGradient="conic(from 4.9rad at 0% 150%, green.400, DISCORD.200, yellow.300, green.500)"
          bgBlendMode={"color"}
          boxShadow="md"
          borderWidth={2}
        >
          <PopoverArrow />
          <PopoverCloseButton onClick={closePopover} />
          <PopoverHeader
            border="none"
            fontWeight={"semibold"}
            bg="gray.700"
            borderRadius={"9px"}
          >
            Edit & customize your guild
          </PopoverHeader>
        </PopoverContent>
        <PopoverAnchor>
          <IconButton
            ref={editBtnRef}
            aria-label="Edit & customize guild"
            minW={"44px"}
            rounded="full"
            colorScheme="alpha"
            onClick={handleOpen}
            data-dd-action-name="Edit guild"
            icon={<PencilSimple />}
          />
        </PopoverAnchor>
      </Popover>
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

                {isOwner && (
                  <Section title="Guild admins">
                    <Admins />
                  </Section>
                )}

                <Section title="Customize appearance">
                  <ColorPicker label="Main color" fieldName="theme.color" />
                  <ColorModePicker label="Color mode" fieldName="theme.mode" />
                  <BackgroundImageUploader setUploadPromise={setUploadPromise} />
                  <MembersToggle />
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
              disabled={/* !isDirty || */ isLoading || isSigning || shouldBeLoading}
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
