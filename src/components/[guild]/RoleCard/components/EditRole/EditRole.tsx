import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"
import { PencilSimple } from "@phosphor-icons/react"
import { ApiRequirementHandlerProvider } from "components/[guild]/RequirementHandlerContext"
import useGuild from "components/[guild]/hooks/useGuild"
import DiscardAlert from "components/common/DiscardAlert"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import EditRequirements from "components/create-guild/Requirements/EditRequirements"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useRef } from "react"
import { FormProvider } from "react-hook-form"
import EditRoleFooter from "./components/EditRoleFooter"
import EditRoleHeader from "./components/EditRoleHeader"
import EditRolePlatforms from "./components/EditRolePlatforms"
import RoleGroupSelect from "./components/RoleGroupSelect"
import useEditRoleForm from "./hooks/useEditRoleForm"
import useSubmitEditRole from "./hooks/useSubmitEditRole"

type Props = { roleId: number }

const EditRole = ({ roleId }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  const methods = useEditRoleForm(roleId)
  const { control, reset, formState, defaultValues } = methods

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

  const { onSubmit, isLoading, loadingText, iconUploader } = useSubmitEditRole({
    roleId,
    methods,
    onSuccess: onClose,
  })

  const drawerBodyRef = useRef<HTMLDivElement>()

  return (
    <>
      <IconButton
        ref={btnRef}
        icon={<Icon as={PencilSimple} />}
        size="sm"
        rounded="full"
        aria-label="Edit role"
        onClick={onOpen}
      />

      <Drawer
        isOpen={isOpen}
        placement="left"
        size={{ base: "full", md: "lg" }}
        onClose={isDirty ? onAlertOpen : onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody ref={drawerBodyRef} className="custom-scrollbar" pb={28}>
            <FormProvider {...methods}>
              <ApiRequirementHandlerProvider roleId={roleId}>
                <EditRoleHeader onClose={onCloseAndClear} roleId={roleId} />
                <VStack spacing={10} alignItems="start">
                  <EditRolePlatforms roleId={roleId} />
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
              </ApiRequirementHandlerProvider>
            </FormProvider>
          </DrawerBody>

          <EditRoleFooter
            onClose={onCloseAndClear}
            onSubmit={onSubmit}
            isLoading={isLoading}
            loadingText={loadingText}
            isDirty={isDirty || iconUploader.isUploading}
          />
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

const EditRoleWrapper = ({ roleId }: Props) => {
  const { isDetailed } = useGuild()
  if (!isDetailed)
    return <IconButton size="sm" rounded="full" aria-label="Edit role" isLoading />

  return <EditRole roleId={roleId} />
}

export default EditRoleWrapper
