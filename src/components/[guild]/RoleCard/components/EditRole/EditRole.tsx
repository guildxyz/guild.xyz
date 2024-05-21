import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import RolePlatforms from "components/[guild]/RolePlatforms"
import SetVisibility, {
  type SetVisibilityForm,
} from "components/[guild]/SetVisibility"
import useVisibilityModalProps from "components/[guild]/SetVisibility/hooks/useVisibilityModalProps"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import OnboardingMarker from "components/common/OnboardingMarker"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import EditRequirements from "components/create-guild/Requirements/EditRequirements"
import { AnimatePresence, motion } from "framer-motion"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useToast from "hooks/useToast"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { ArrowLeft, Check, PencilSimple } from "phosphor-react"
import { useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Logic, RolePlatform, Visibility } from "types"
import handleSubmitDirty from "utils/handleSubmitDirty"
import DeleteRoleButton from "./components/DeleteRoleButton"
import RoleGroupSelect from "./components/RoleGroupSelect"
import useEditRole from "./hooks/useEditRole"

type Props = {
  roleId: number
}

export type RoleEditFormData = {
  id: number
  name: string
  description: string
  imageUrl: string
  logic: Logic
  rolePlatforms: RolePlatform[]
  visibility: Visibility
  visibilityRoleId?: number
  anyOfNum?: number
  groupId?: number
}

const MotionDrawerFooter = motion(DrawerFooter)
// Footer is 76px high
const FOOTER_OFFSET = 76

const EditRole = ({ roleId }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const { captureEvent } = usePostHogContext()

  const { roles } = useGuild()
  const {
    id,
    name,
    description,
    imageUrl,
    logic,
    anyOfNum,
    rolePlatforms,
    visibility,
    visibilityRoleId,
    groupId,
  } = roles?.find((role) => role.id === roleId) ?? {}

  const defaultValues: RoleEditFormData = {
    id,
    name,
    description,
    imageUrl,
    logic,
    anyOfNum: anyOfNum ?? 1,
    rolePlatforms: rolePlatforms ?? [],
    visibility,
    visibilityRoleId,
    groupId,
  }
  const methods = useForm<RoleEditFormData>({
    mode: "all",
    defaultValues,
  })
  const { control, setValue, reset, formState } = methods

  useEffect(() => {
    const role = roles?.find((r) => r.id === roleId)
    if (!role) return

    reset({
      ...role,
      rolePlatforms: role.rolePlatforms ?? [],
      anyOfNum: role.anyOfNum ?? 1,
    })
  }, [roles, roleId, reset])

  const handleOpen = () => {
    onOpen()
    // needed for correct remove platform behavior after adding new platform -> saving -> opening edit again
    setValue("rolePlatforms", rolePlatforms ?? [])
  }

  const toast = useToast()

  const setVisibilityModalProps = useVisibilityModalProps()
  const onSuccess = () => {
    toast({
      title: `Role successfully updated!`,
      status: "success",
    })
    setVisibilityModalProps.onClose()
    onClose()
    reset(undefined, { keepValues: true })
  }

  const { onSubmit, isLoading, isSigning, signLoadingText } = useEditRole(
    id,
    onSuccess
  )

  /**
   * TODO: for some reason, isDirty was true & dirtyFields was an empty object and I
   * couldn't find the underlying problem, so used this workaround here, but we
   * should definitely find out what causes this strange behaviour!
   */
  const isDirty = Object.values(formState.dirtyFields).length > 0
  useWarnIfUnsavedChanges(isDirty && !formState.isSubmitted)

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const onCloseAndClear = () => {
    reset(defaultValues)
    onAlertClose()
    onClose()
  }

  const iconUploader = usePinata({
    fieldToSetOnSuccess: "imageUrl",
    fieldToSetOnError: "imageUrl",
    control,
  })

  const drawerBodyRef = useRef<HTMLDivElement>()
  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    handleSubmitDirty(methods)(onSubmit),
    iconUploader.isUploading
  )

  const loadingText = signLoadingText || uploadLoadingText || "Saving data"

  const handleVisibilitySave = ({
    visibility: newVisibility,
    visibilityRoleId: newVisibilityRoleId,
  }: SetVisibilityForm) => {
    setValue("visibility", newVisibility, {
      shouldDirty: true,
    })
    setValue("visibilityRoleId", newVisibilityRoleId, {
      shouldDirty: true,
    })
    setVisibilityModalProps.onClose()
  }

  return (
    <>
      <OnboardingMarker
        step={3}
        onClick={() => {
          captureEvent("guild creation flow > pulse marker: Edit role clicked")
          handleOpen()
        }}
      >
        <IconButton
          ref={btnRef}
          icon={<Icon as={PencilSimple} />}
          size="sm"
          rounded="full"
          aria-label="Edit role"
          onClick={handleOpen}
        />
      </OnboardingMarker>

      <Drawer
        isOpen={isOpen}
        placement="left"
        size={{ base: "full", md: "lg" }}
        onClose={isDirty ? onAlertOpen : onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody ref={drawerBodyRef} className="custom-scrollbar" pb={24}>
            <FormProvider {...methods}>
              <DrawerHeader
                title="Edit role"
                justifyContent="start"
                spacing={1}
                alignItems="center"
                w="full"
                leftElement={
                  <IconButton
                    aria-label="Back"
                    icon={<Icon as={ArrowLeft} boxSize="1.1em" weight="bold" />}
                    display={{ base: "flex", md: "none" }}
                    borderRadius="full"
                    maxW={10}
                    maxH={10}
                    mr={2}
                    onClick={onCloseAndClear}
                  >
                    Cancel
                  </IconButton>
                }
              >
                <HStack justifyContent={"space-between"} flexGrow={1}>
                  <SetVisibility
                    entityType="role"
                    defaultValues={{
                      visibility: defaultValues.visibility,
                      visibilityRoleId: defaultValues.visibilityRoleId,
                    }}
                    onSave={handleVisibilitySave}
                    {...setVisibilityModalProps}
                  />
                  {roles?.length > 1 && (
                    <DeleteRoleButton roleId={id} onDrawerClose={onClose} />
                  )}
                </HStack>
              </DrawerHeader>
              <VStack spacing={10} alignItems="start">
                <RolePlatforms roleId={roleId} />
                <Section title="General">
                  <Box>
                    <FormLabel>Logo and name</FormLabel>
                    <HStack spacing={2} alignItems="start">
                      <IconSelector uploader={iconUploader} />
                      <Name />
                    </HStack>
                  </Box>
                  <Description />
                  <RoleGroupSelect />
                </Section>

                <EditRequirements roleId={roleId} />
              </VStack>
            </FormProvider>
          </DrawerBody>

          <AnimatePresence>
            {(isDirty || iconUploader.isUploading) && (
              <MotionDrawerFooter
                initial={{ y: FOOTER_OFFSET, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: FOOTER_OFFSET, opacity: 0 }}
                transition={{ duration: 0.3 }}
                position="absolute"
                w="full"
                zIndex={1}
                bottom="0"
              >
                <Button variant="outline" mr={3} onClick={onCloseAndClear}>
                  Cancel
                </Button>
                <Button
                  isLoading={isLoading || isSigning || isUploadingShown}
                  colorScheme="green"
                  loadingText={loadingText}
                  onClick={handleSubmit}
                  leftIcon={<Icon as={Check} />}
                  data-test="save-role-button"
                >
                  Save
                </Button>
              </MotionDrawerFooter>
            )}
          </AnimatePresence>
        </DrawerContent>
        <DynamicDevTool control={control} />
      </Drawer>

      <DiscardAlert
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        onDiscard={onCloseAndClear}
      />
    </>
  )
}

const EditRoleWrapper = ({ roleId }) => {
  const { isDetailed } = useGuild()
  if (!isDetailed)
    return (
      <OnboardingMarker step={3}>
        <IconButton size="sm" rounded="full" aria-label="Edit role" isLoading />
      </OnboardingMarker>
    )

  return <EditRole roleId={roleId} />
}

export default EditRoleWrapper
