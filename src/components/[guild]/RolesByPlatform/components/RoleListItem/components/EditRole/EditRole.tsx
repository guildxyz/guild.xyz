import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  FormLabel,
  HStack,
  Icon,
  IconButton,
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
import SetRequirements from "components/create-guild/Requirements"
import useGuild from "components/[guild]/hooks/useGuild"
import { useOnboardingContext } from "components/[guild]/Onboarding/components/OnboardingProvider"
import useUploadPromise from "hooks/useUploadPromise"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { Check, PencilSimple } from "phosphor-react"
import { useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Role } from "types"
import mapRequirements from "utils/mapRequirements"
import ChannelsToGate from "./components/ChannelsToGate"
import DeleteRoleButton from "./components/DeleteRoleButton"
import useEditRole from "./hooks/useEditRole"

type Props = {
  roleData: Role
}

const EditRole = ({ roleData }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })
  const btnRef = useRef()

  const { roles, platforms } = useGuild()
  const { id, name, description, imageUrl, logic, requirements } = roleData

  const defaultValues = {
    roleId: id,
    name,
    description,
    imageUrl,
    logic,
    requirements: mapRequirements(requirements),
  }
  const methods = useForm({
    mode: "all",
    defaultValues,
  })

  const onSuccess = () => {
    onClose()
    methods.reset(undefined, { keepValues: true })
  }

  const { onSubmit, isLoading, isSigning } = useEditRole(id, onSuccess)

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

  const { handleSubmit, isUploading, setUploadPromise, shouldBeLoading } =
    useUploadPromise(methods.handleSubmit)

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isUploading) return "Uploading image"
    return "Saving data"
  }

  const { localStep } = useOnboardingContext()

  return (
    <>
      <OnboardingMarker step={0}>
        <IconButton
          ref={btnRef}
          icon={<Icon as={PencilSimple} />}
          size="sm"
          rounded="full"
          aria-label="Edit role"
          data-dd-action-name={
            localStep === null ? "Edit role" : "Edit role [onboarding]"
          }
          onClick={onOpen}
        />
      </OnboardingMarker>

      <Drawer
        isOpen={isOpen}
        placement="left"
        size={drawerSize}
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
                {platforms?.[0]?.type === "DISCORD" && (
                  <>
                    <Section title="Discord settings" spacing="6">
                      <ChannelsToGate
                        roleId={roleData.platforms?.[0]?.discordRoleId}
                      />
                    </Section>
                    <Divider />
                  </>
                )}

                <Section title="General" spacing="6">
                  <Box>
                    <FormLabel>Logo and name</FormLabel>
                    <HStack spacing={2} alignItems="start">
                      <IconSelector setUploadPromise={setUploadPromise} />
                      <Name />
                    </HStack>
                  </Box>
                  <Description />
                  <SetRequirements maxCols={2} />
                </Section>
              </VStack>
            </FormProvider>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onCloseAndClear}>
              Cancel
            </Button>
            <Button
              disabled={isLoading || isSigning || shouldBeLoading}
              isLoading={isLoading || isSigning || shouldBeLoading}
              colorScheme="green"
              loadingText={loadingText()}
              onClick={handleSubmit(onSubmit)}
              leftIcon={<Icon as={Check} />}
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

export default EditRole
