import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  DrawerProps,
  FormLabel,
  HStack,
  IconButton,
  Stack,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import OnboardingMarker from "components/common/OnboardingMarker"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import MembersToggle from "components/[guild]/EditGuildButton/components/MembersToggle"
import UrlName from "components/[guild]/EditGuildButton/components/UrlName"
import useGuild from "components/[guild]/hooks/useGuild"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useUploadPromise from "hooks/useUploadPromise"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { Gear } from "phosphor-react"
import { useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import useGuildPermission from "../hooks/useGuildPermission"
import { useOnboardingContext } from "../Onboarding/components/OnboardingProvider"
import Admins from "./components/Admins"
import BackgroundImageUploader from "./components/BackgroundImageUploader"
import ColorModePicker from "./components/ColorModePicker"
import ColorPicker from "./components/ColorPicker"
import DeleteGuildButton from "./components/DeleteGuildButton"
import Guard from "./components/Guard"
import HideFromExplorerToggle from "./components/HideFromExplorerToggle"
import useEditGuild from "./hooks/useEditGuild"

const EditGuildButton = ({
  finalFocusRef,
}: Omit<DrawerProps, "children">): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const editBtnRef = useRef()
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })
  const { isOwner } = useGuildPermission()

  const {
    name,
    imageUrl,
    description,
    theme,
    showMembers,
    admins,
    urlName,
    platforms,
    hideFromExplorer,
    roles,
  } = useGuild()
  const isGuarded = platforms?.[0]?.isGuarded

  const defaultValues = {
    name,
    imageUrl,
    description,
    theme: theme ?? {},
    showMembers,
    admins: admins?.flatMap((admin) => (admin.isOwner ? [] : admin.address)) ?? [],
    urlName,
    isGuarded,
    hideFromExplorer,
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

  const { onSubmit, isLoading, isSigning } = useEditGuild({ onSuccess })

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

  const isDirty = methods?.formState?.isDirty || uploadPromise

  const { localStep } = useOnboardingContext()

  return (
    <>
      <OnboardingMarker step={1}>
        <IconButton
          ref={editBtnRef}
          aria-label="Edit & customize guild"
          minW={"44px"}
          rounded="full"
          colorScheme="alpha"
          onClick={onOpen}
          data-dd-action-name={
            localStep === null ? "Edit guild" : "Edit guild [onboarding]"
          }
          icon={<Gear />}
        />
      </OnboardingMarker>

      <Drawer
        isOpen={isOpen}
        placement="left"
        size={drawerSize}
        onClose={isDirty ? onAlertOpen : onClose}
        finalFocusRef={finalFocusRef}
      >
        <DrawerOverlay />
        <FormProvider {...methods}>
          <DrawerContent>
            <DrawerBody className="custom-scrollbar">
              <DrawerHeader title="Edit guild">
                <DeleteGuildButton />
              </DrawerHeader>
              <VStack spacing={10} alignItems="start">
                <Section title="General" spacing="6">
                  <Stack
                    w="full"
                    spacing="6"
                    direction={{ base: "column", md: "row" }}
                  >
                    <Box>
                      <FormLabel>Logo and name</FormLabel>
                      <HStack spacing={2} alignItems="start">
                        <IconSelector setUploadPromise={setUploadPromise} />
                        <Name />
                      </HStack>
                    </Box>
                    <UrlName />
                  </Stack>
                  <Description />
                </Section>

                <Section title="Appearance" spacing="6">
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    justifyContent={"space-between"}
                    spacing="6"
                    sx={{
                      "> *": {
                        flex: "1 0",
                      },
                    }}
                  >
                    <ColorPicker fieldName="theme.color" />
                    <BackgroundImageUploader setUploadPromise={setUploadPromise} />
                    <ColorModePicker fieldName="theme.mode" />
                  </Stack>
                </Section>

                <Divider />

                <Section title="Security">
                  <MembersToggle />
                  <HideFromExplorerToggle />
                  {platforms?.[0]?.type === "DISCORD" && (
                    <Guard
                      isOn={isGuarded}
                      isDisabled={!roles?.[0]?.platforms?.[0]?.inviteChannel}
                    />
                  )}

                  {isOwner && <Admins />}
                </Section>
              </VStack>
              {/* <VStack alignItems="start" spacing={4} width="full"></VStack> */}
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onCloseAndClear}>
                Cancel
              </Button>
              <Button
                disabled={
                  /* !isDirty || */ isLoading || isSigning || shouldBeLoading
                }
                isLoading={isLoading || isSigning || shouldBeLoading}
                colorScheme="green"
                loadingText={loadingText()}
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </FormProvider>
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
