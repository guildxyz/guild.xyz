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
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import MembersToggle from "components/[guild]/EditGuild/components/MembersToggle"
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
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import dynamic from "next/dynamic"
import { useEffect } from "react"
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
import HideFromExplorerToggle from "./components/HideFromExplorerToggle"
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
    isDetailed,
    featureFlags,
    tags: savedTags,
  } = useGuild()
  const { isOwner } = useGuildPermission()
  const { isSuperAdmin } = useUser()

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
  }
  const methods = useForm<GuildFormType>({
    mode: "all",
    defaultValues,
  })

  const { onSubmit: onTagsSubmit } = useEditTags()

  // We'll only receive this info on client-side, so we're setting the default value of this field in a useEffect
  useEffect(() => {
    if (!isDetailed || methods.formState.dirtyFields.contacts) return
    methods.setValue("contacts", contacts)
  }, [isDetailed])

  const onSuccess = () => {
    onClose()
    methods.reset(undefined, { keepValues: true })
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

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const onCloseAndClear = () => {
    const themeColor = theme?.color
    const backgroundImage = theme?.backgroundImage
    if (themeColor !== localThemeColor) setLocalThemeColor(themeColor)
    if (backgroundImage !== localBackgroundImage)
      setLocalBackgroundImage(backgroundImage)
    methods.reset()
    onAlertClose()
    onClose()
  }

  const iconUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      methods.setValue(
        "imageUrl",
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`,
        { shouldTouch: true, shouldDirty: true }
      )
    },
    onError: () => {
      methods.setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`, {
        shouldTouch: true,
      })
    },
  })

  const backgroundUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      methods.setValue(
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
    !!Object.keys(methods.formState.dirtyFields).length ||
    backgroundUploader.isUploading ||
    iconUploader.isUploading

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
                {isOwner ? (
                  <DeleteGuildButton
                    beforeDelete={() => methods.reset(defaultValues)}
                  />
                ) : (
                  <LeaveButton disableColoring />
                )}
              </DrawerHeader>
              <VStack spacing={10} alignItems="start">
                <Section title="General">
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
                </Section>

                <Section title="Appearance">
                  <Stack direction={{ base: "column", md: "row" }} spacing="5">
                    <ColorPicker fieldName="theme.color" />
                    <BackgroundImageUploader uploader={backgroundUploader} />
                  </Stack>
                </Section>

                <Divider />

                <Section title="Security">
                  <MembersToggle />
                  <HideFromExplorerToggle />

                  <Admins />
                </Section>

                <Divider />

                <Section title="Contact info" spacing="4">
                  <ContactInfo />
                </Section>

                {isSuperAdmin && (
                  <>
                    <Divider />
                    <Section title="Tag manager" spacing="4">
                      <TagManager />
                    </Section>
                    <Section title="Enabled features" spacing="4">
                      <DynamicFeatureFlags />
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
                isLoading={isLoading || isUploadingShown}
                colorScheme="green"
                loadingText={loadingText}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </FormProvider>
        <DynamicDevTool control={methods.control} />
      </Drawer>

      <DiscardAlert
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        onDiscard={onCloseAndClear}
      />
    </>
  )
}

export default EditGuildDrawer
