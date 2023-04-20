import {
  Box,
  Collapse,
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
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import ErrorAlert from "components/common/ErrorAlert"
import OnboardingMarker from "components/common/OnboardingMarker"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import SetRequirements from "components/create-guild/Requirements"
import useGuild from "components/[guild]/hooks/useGuild"
import RolePlatforms from "components/[guild]/RolePlatforms"
import SetVisibility from "components/[guild]/SetVisibility"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { Check, PencilSimple } from "phosphor-react"
import { useEffect, useRef } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"
import mapRequirements from "utils/mapRequirements"
import DeleteRoleButton from "./components/DeleteRoleButton"
import useEditRole from "./hooks/useEditRole"

const noRequirementsErrorMessage = "Set some requirements, or make the role free"

type Props = {
  roleId: number
}

const EditRole = ({ roleId }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  const { roles } = useGuild()
  const {
    id,
    name,
    description,
    imageUrl,
    logic,
    requirements,
    rolePlatforms,
    visibility,
  } = roles?.find((role) => role.id === roleId) ?? {}

  const defaultValues = {
    roleId: id,
    name,
    description,
    imageUrl,
    logic,
    requirements: mapRequirements(requirements),
    rolePlatforms: rolePlatforms ?? [],
    visibility,
  }
  const methods = useForm({
    mode: "all",
    defaultValues,
  })

  useEffect(() => {
    const role = roles?.find((r) => r.id === roleId)
    if (!role) return

    methods.reset({
      ...role,
      roleId: role.id,
      requirements: mapRequirements(role.requirements),
      rolePlatforms: role.rolePlatforms ?? [],
    })
  }, [roles, roleId])

  const handleOpen = () => {
    onOpen()
    // needed for correct remove platform behavior after adding new platform -> saving -> opening edit again
    methods.setValue("rolePlatforms", rolePlatforms ?? [])
  }

  const onSuccess = () => {
    onClose()
    methods.reset(undefined, { keepValues: true })
  }

  const { onSubmit, isLoading, isSigning, signLoadingText } = useEditRole(
    id,
    onSuccess
  )

  const isDirty = !!Object.keys(methods.formState.dirtyFields).length
  useWarnIfUnsavedChanges(isDirty && !methods.formState.isSubmitted)

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const onCloseAndClear = () => {
    methods.reset(defaultValues)
    onAlertClose()
    onClose()
  }

  const iconUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      methods.setValue(
        "imageUrl",
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`,
        {
          shouldTouch: true,
        }
      )
    },
    onError: () => {
      methods.setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`, {
        shouldTouch: true,
      })
    },
  })

  const formRequirements = useWatch({
    name: "requirements",
    control: methods.control,
  })
  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    (...props) => {
      methods.clearErrors("requirements")
      if (!formRequirements || formRequirements?.length === 0) {
        methods.setError(
          "requirements",
          {
            message: noRequirementsErrorMessage,
          },
          { shouldFocus: true }
        )
        document.getElementById("free-entry-checkbox")?.focus()
      } else {
        return methods.handleSubmit(onSubmit)(...props)
      }
    },

    iconUploader.isUploading
  )

  const loadingText = signLoadingText || uploadLoadingText || "Saving data"

  return (
    <>
      <OnboardingMarker step={0} onClick={handleOpen}>
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
          <DrawerBody className="custom-scrollbar">
            <FormProvider {...methods}>
              <DrawerHeader
                title="Edit role"
                justifyContent="start"
                spacing={1}
                alignItems="center"
                w="full"
              >
                <HStack justifyContent={"space-between"} flexGrow={1}>
                  <SetVisibility entityType="role" />
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
                </Section>
                <SetRequirements />

                <Collapse
                  in={!!methods.formState.errors?.requirements}
                  style={{
                    width: "100%",
                  }}
                >
                  <ErrorAlert label={noRequirementsErrorMessage} />
                </Collapse>
              </VStack>
            </FormProvider>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onCloseAndClear}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading || isSigning || isUploadingShown}
              colorScheme="green"
              loadingText={loadingText}
              onClick={handleSubmit}
              leftIcon={<Icon as={Check} />}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
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

const EditRoleWrapper = ({ roleId }) => {
  const { isDetailed } = useGuild()
  if (!isDetailed)
    return (
      <OnboardingMarker step={0}>
        <IconButton size="sm" rounded="full" aria-label="Edit role" isLoading />
      </OnboardingMarker>
    )

  return <EditRole roleId={roleId} />
}

export default EditRoleWrapper
