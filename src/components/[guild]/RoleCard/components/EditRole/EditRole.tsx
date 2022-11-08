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
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import OnboardingMarker from "components/common/OnboardingMarker"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import SetRequirements from "components/create-guild/Requirements"
import useGuild from "components/[guild]/hooks/useGuild"
import { useOnboardingContext } from "components/[guild]/Onboarding/components/OnboardingProvider"
import RolePlatforms from "components/[guild]/RolePlatforms"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { Check, PencilSimple } from "phosphor-react"
import { useRef } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"
import mapRequirements from "utils/mapRequirements"
import DeleteRoleButton from "./components/DeleteRoleButton"
import useEditRole from "./hooks/useEditRole"

type Props = {
  roleId: number
}

const EditRole = ({ roleId }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  const { roles } = useGuild()
  const { id, name, description, imageUrl, logic, requirements, rolePlatforms } =
    roles?.find((role) => role.id === roleId) ?? {}

  const defaultValues = {
    roleId: id,
    name,
    description,
    imageUrl,
    logic,
    requirements: mapRequirements(requirements),
    rolePlatforms: rolePlatforms ?? [],
  }
  const methods = useForm({
    mode: "all",
    defaultValues,
  })

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

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

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
            message: "Set some requirements, or make the role free",
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

  const { localStep } = useOnboardingContext()

  return (
    <>
      <OnboardingMarker step={0} onClick={handleOpen}>
        <IconButton
          ref={btnRef}
          icon={<Icon as={PencilSimple} />}
          size="sm"
          rounded="full"
          aria-label="Edit role"
          data-dd-action-name={
            localStep === null ? "Edit role" : "Edit role [onboarding]"
          }
          onClick={handleOpen}
        />
      </OnboardingMarker>

      <Drawer
        isOpen={isOpen}
        placement="left"
        size={{ base: "full", md: "lg" }}
        onClose={methods.formState.isDirty ? onAlertOpen : onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody className="custom-scrollbar">
            <DrawerHeader title="Edit role">
              {roles?.length > 1 && <DeleteRoleButton roleId={id} />}
            </DrawerHeader>
            <FormProvider {...methods}>
              <VStack spacing={10} alignItems="start">
                <RolePlatforms roleId={roleId} />
                <Section title="General" spacing="6">
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
              </VStack>
            </FormProvider>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onCloseAndClear}>
              Cancel
            </Button>
            <Button
              disabled={isLoading || isSigning || isUploadingShown}
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
