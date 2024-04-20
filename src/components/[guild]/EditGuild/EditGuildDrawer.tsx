import {
  Box,
  ButtonGroup,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  DrawerProps,
  FormLabel,
  HStack,
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import UrlName from "components/[guild]/EditGuild/components/UrlName"
import useGuild from "components/[guild]/hooks/useGuild"
import { useThemeContext } from "components/[guild]/ThemeContext"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import Section from "components/common/Section"
import ContactInfo from "components/create-guild/BasicInfo/components/ContactInfo"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import useGuildEvents from "hooks/useGuildEvents"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useToast from "hooks/useToast"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import dynamic from "next/dynamic"
import { FormProvider, useForm } from "react-hook-form"
import { GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"
import handleSubmitDirty from "utils/handleSubmitDirty"
import useGuildPermission from "../hooks/useGuildPermission"
import useUser from "../hooks/useUser"
import LeaveButton from "../LeaveButton"
import Admins from "./components/Admins"
import BackgroundImageUploader from "./components/BackgroundImageUploader"
import ColorPicker from "./components/ColorPicker"
import DeleteGuildButton from "./components/DeleteGuildButton"
import Events from "./components/Events/Events"
import HideFromExplorerToggle from "./components/HideFromExplorerToggle"
import SaveAlert from "./components/SaveAlert"
import SocialLinks from "./components/SocialLinks"
import TagManager from "./components/TagManager"
import useEditGuild from "./hooks/useEditGuild"
import useEditTags from "./hooks/useEditTags"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const DynamicFeatureFlags = dynamic(() => import("./components/FeatureFlags"))

const EditGuildDrawer = ({
  finalFocusRef,
  isOpen,
  onClose,
}: Omit<DrawerProps & Props, "children">): JSX.Element => {
  const {
    name,
    imageUrl,
    description,
    theme,
    showMembers,
    admins,
    urlName,
    hideFromExplorer,
    socialLinks,
    contacts,
    featureFlags,
    eventSources,
    tags: savedTags,
    guildPin,
  } = useGuild()
  const { isOwner } = useGuildPermission()
  const { isSuperAdmin } = useUser()
  const { mutate: mutateEvents } = useGuildEvents()

  const defaultValues = {
    name,
    imageUrl,
    description,
    theme: theme
      ? {
          backgroundCss: theme?.backgroundCss,
          backgroundImage: theme?.backgroundImage,
          color: theme?.color,
        }
      : {},
    showMembers,
    admins: admins ?? [],
    urlName,
    hideFromExplorer,
    contacts,
    socialLinks,
    featureFlags: isSuperAdmin ? featureFlags : undefined,
    tags: savedTags,
    eventSources: {
      EVENTBRITE: eventSources ? eventSources.EVENTBRITE : null,
      LUMA: eventSources ? eventSources.LUMA : null,
      LINK3: eventSources ? eventSources.LINK3 : null,
    },
  }
  const methods = useForm<GuildFormType>({
    mode: "all",
    defaultValues,
  })
  const { control, setValue, reset, formState } = methods

  const { onSubmit: onTagsSubmit } = useEditTags()

  const toast = useToast()

  const onSuccess = () => {
    toast({
      title: `Guild successfully updated!`,
      status: "success",
    })
    onClose()
    mutateEvents()
    reset(undefined, { keepValues: true })
  }

  const { onSubmit, isLoading } = useEditGuild({
    onSuccess,
  })

  const {
    localThemeColor,
    setLocalThemeColor,
    localBackgroundImage,
    setLocalBackgroundImage,
  } = useThemeContext()

  useWarnIfUnsavedChanges(formState.isDirty && !formState.isSubmitted)

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const {
    isOpen: isSaveAlertOpen,
    onOpen: onSaveAlertOpen,
    onClose: onSaveAlertClose,
  } = useDisclosure()

  const onCloseAndClear = () => {
    const themeColor = theme?.color
    const backgroundImage = theme?.backgroundImage
    if (themeColor !== localThemeColor) setLocalThemeColor(themeColor)
    if (backgroundImage !== localBackgroundImage)
      setLocalBackgroundImage(backgroundImage)
    reset()
    onAlertClose()
    onClose()
  }

  const iconUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`, {
        shouldTouch: true,
        shouldDirty: true,
      })
    },
    onError: () => {
      setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`, {
        shouldTouch: true,
      })
    },
  })

  const backgroundUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue(
        "theme.backgroundImage",
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`,
        { shouldDirty: true }
      )
    },
    onError: () => {
      setLocalBackgroundImage(null)
    },
  })

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    () => {
      handleSubmitDirty(methods)((data) => {
        onSubmit({ ...data, tags: undefined })
        if (data.tags) onTagsSubmit(data.tags)
      })()
    },
    backgroundUploader.isUploading || iconUploader.isUploading
  )

  const loadingText = uploadLoadingText || "Saving data"

  const isDirty =
    !!Object.keys(formState.dirtyFields).length ||
    backgroundUploader.isUploading ||
    iconUploader.isUploading

  const onSave = (e) => {
    if (
      guildPin?.isActive &&
      (formState.dirtyFields.name ||
        formState.dirtyFields.imageUrl ||
        iconUploader.isUploading ||
        formState.dirtyFields.theme?.color)
    ) {
      onSaveAlertOpen()
    } else {
      handleSubmit(e)
    }
  }

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="left"
        size={{ base: "full", md: "xl" }}
        onClose={isDirty ? onAlertOpen : onClose}
        finalFocusRef={finalFocusRef}
      >
        <DrawerOverlay />
        <FormProvider {...methods}>
          <DrawerContent>
            <DrawerBody className="custom-scrollbar">
              <DrawerHeader title="Edit guild">
                <ButtonGroup>
                  {!isOwner && <LeaveButton disableColoring />}
                  {(isOwner || isSuperAdmin) && (
                    <DeleteGuildButton beforeDelete={() => reset(defaultValues)} />
                  )}
                </ButtonGroup>
              </DrawerHeader>
              <VStack spacing={10} alignItems="start">
                <Section title="General" spacing="4">
                  <Stack spacing={5}>
                    <Stack
                      w="full"
                      spacing="5"
                      direction={{ base: "column", md: "row" }}
                    >
                      <Box>
                        <FormLabel>Logo and name</FormLabel>
                        <HStack spacing={2} alignItems="start">
                          <IconSelector
                            uploader={iconUploader}
                            minW={512}
                            minH={512}
                          />
                          <Name />
                        </HStack>
                      </Box>
                      <UrlName />
                    </Stack>
                    <Description />
                    <Box>
                      <FormLabel>Social links</FormLabel>
                      <SocialLinks />
                    </Box>
                  </Stack>
                </Section>

                <Section title="Appearance" spacing="4">
                  <Stack direction={{ base: "column", md: "row" }} spacing="5">
                    <ColorPicker fieldName="theme.color" />
                    <BackgroundImageUploader uploader={backgroundUploader} />
                  </Stack>
                </Section>

                <Divider />

                <Section title="Events" spacing="2">
                  <Events />
                </Section>

                <Divider />

                <Section title="Security" spacing="4">
                  {savedTags?.includes("VERIFIED") && <HideFromExplorerToggle />}

                  <Admins />
                </Section>

                <Divider />

                <Section title="Contact info" spacing="2">
                  <ContactInfo />
                </Section>

                {isSuperAdmin && (
                  <>
                    <Divider />

                    <Section title="Superadmin" spacing="4">
                      <TagManager />
                      <Box>
                        <FormLabel>Enabled features</FormLabel>
                        <DynamicFeatureFlags />
                      </Box>
                    </Section>
                  </>
                )}
              </VStack>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onCloseAndClear}>
                Cancel
              </Button>
              <Button
                // isDisabled={!isDirty}
                isDisabled={Object.keys(formState?.errors ?? {}).length > 0}
                data-test="save-guild-button"
                isLoading={isLoading || isUploadingShown}
                colorScheme="green"
                loadingText={loadingText}
                onClick={onSave}
              >
                Save
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </FormProvider>
        <DynamicDevTool control={control} />
      </Drawer>

      <DiscardAlert
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        onDiscard={onCloseAndClear}
      />

      <SaveAlert
        isOpen={isSaveAlertOpen}
        onClose={onSaveAlertClose}
        onSave={handleSubmit}
      />
    </>
  )
}

export default EditGuildDrawer
