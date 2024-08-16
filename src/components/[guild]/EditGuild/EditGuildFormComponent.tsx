import {
  Box,
  Divider,
  FormLabel,
  HStack,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"
import Admins from "components/[guild]/EditGuild/components/Admins/Admins"
import BackgroundImageUploader from "components/[guild]/EditGuild/components/BackgroundImageUploader"
import ChangingGuildPinDesignAlert from "components/[guild]/EditGuild/components/ChangingGuildPinDesignAlert"
import GuildColorPicker from "components/[guild]/EditGuild/components/GuildColorPicker"
import HideFromExplorerToggle from "components/[guild]/EditGuild/components/HideFromExplorerToggle"
import SocialLinks from "components/[guild]/EditGuild/components/SocialLinks"
import TagManager from "components/[guild]/EditGuild/components/TagManager"
import UrlName from "components/[guild]/EditGuild/components/UrlName"
import useEditGuild from "components/[guild]/EditGuild/hooks/useEditGuild"
import useEditTags from "components/[guild]/EditGuild/hooks/useEditTags"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import { FloatingFooter } from "components/common/FloatingFooter"
import Section from "components/common/Section"
import ContactInfo from "components/create-guild/BasicInfo/components/ContactInfo"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import { AnimatePresence, motion } from "framer-motion"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useToast from "hooks/useToast"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import dynamic from "next/dynamic"
import { useCallback } from "react"
import { FormProvider, useForm } from "react-hook-form"
import handleSubmitDirty from "utils/handleSubmitDirty"
import { EditGuildForm } from "./types"

const DynamicFeatureFlags = dynamic(
  () => import("components/[guild]/EditGuild/components/FeatureFlags")
)

const MotionFloatingFooter = motion(FloatingFooter)

const EditGuildFormComponent = () => {
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
    tags: savedTags,
    guildPin,
  } = useGuild()
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
    admins: admins?.map(({ address }) => ({ address })) ?? [],
    urlName,
    hideFromExplorer,
    contacts: contacts || [],
    socialLinks,
    featureFlags: isSuperAdmin ? featureFlags : undefined,
    tags: savedTags,
  } satisfies EditGuildForm

  const methods = useForm<EditGuildForm>({
    mode: "all",
    defaultValues,
  })
  const { control, reset, formState } = methods

  const { onSubmit: onTagsSubmit } = useEditTags()

  const toast = useToast()

  const onSuccess = () => {
    toast({
      title: `Guild successfully updated!`,
      status: "success",
    })
    reset(undefined, { keepValues: true })
  }

  const { onSubmit, isLoading } = useEditGuild({
    onSuccess,
  })

  const { setLocalBackgroundImage } = useThemeContext()

  useWarnIfUnsavedChanges(formState.isDirty && !formState.isSubmitted)

  const {
    isOpen: isSaveAlertOpen,
    onOpen: onSaveAlertOpen,
    onClose: onSaveAlertClose,
  } = useDisclosure()

  const iconUploader = usePinata({
    fieldToSetOnSuccess: "imageUrl",
    fieldToSetOnError: "imageUrl",
    control: methods.control,
  })

  const onBackgroundUploadError = useCallback(() => {
    setLocalBackgroundImage(null)
  }, [setLocalBackgroundImage])

  const backgroundUploader = usePinata({
    fieldToSetOnSuccess: "theme.backgroundImage",
    onError: onBackgroundUploadError,
    control: methods.control,
  })

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    () => {
      handleSubmitDirty(methods)((data) => {
        const { tags, ...dataWithoutTags } = data
        onSubmit(dataWithoutTags)
        if (tags) onTagsSubmit(tags)
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
      <FormProvider {...methods}>
        <VStack spacing={10} alignItems="start">
          <Section title="General" spacing="4">
            <Stack spacing={5}>
              <Stack w="full" spacing="5" direction={{ base: "column", md: "row" }}>
                <Box>
                  <FormLabel>Logo and name</FormLabel>
                  <HStack spacing={2} alignItems="start">
                    <IconSelector uploader={iconUploader} minW={512} minH={512} />
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
              <GuildColorPicker fieldName="theme.color" />
              <BackgroundImageUploader uploader={backgroundUploader} />
            </Stack>
          </Section>

          <Divider />

          <Section title="Security" spacing="4">
            {savedTags?.includes("VERIFIED") && <HideFromExplorerToggle />}
            <Admins />
          </Section>

          <Divider />

          <Section title="Contact info" spacing="2">
            <Text colorScheme="gray">
              Only visible to the Guild Team to reach you with support and
              partnership initiatives if needed.
            </Text>
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

        <AnimatePresence>
          {isDirty && (
            <MotionFloatingFooter
              initial={{ bottom: -96 }}
              animate={{ bottom: 0 }}
              exit={{ bottom: -96 }}
            >
              <HStack
                justifyContent="space-between"
                px={{ base: 5, md: 6 }}
                py={{ base: 3, md: 4 }}
              >
                <Text fontSize="sm">You have unsaved changes!</Text>
                <Button
                  // isDisabled={!isDirty}
                  isDisabled={Object.keys(formState?.errors ?? {}).length > 0}
                  data-test="save-guild-button"
                  isLoading={isLoading || isUploadingShown}
                  colorScheme="green"
                  loadingText={loadingText}
                  onClick={onSave}
                  maxW="max-content"
                >
                  Save changes
                </Button>
              </HStack>
            </MotionFloatingFooter>
          )}
        </AnimatePresence>
      </FormProvider>

      <DynamicDevTool control={control} />

      <ChangingGuildPinDesignAlert
        isOpen={isSaveAlertOpen}
        onClose={onSaveAlertClose}
        onSave={handleSubmit}
      />
    </>
  )
}

export { EditGuildFormComponent }
