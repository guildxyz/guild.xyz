import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  FormLabel,
  HStack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useVisibilityModalProps from "components/[guild]/SetVisibility/hooks/useVisibilityModalProps"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useCreateRole, {
  RoleToCreate,
} from "components/create-guild/hooks/useCreateRole"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import SetRequirements from "components/create-guild/Requirements"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useToast from "hooks/useToast"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { RoleFormType, Visibility } from "types"
import getRandomInt from "utils/getRandomInt"
import RolePlatforms from "../../RolePlatforms"
import SetVisibility from "../../SetVisibility"

const AddRoleDrawer = ({ isOpen, onClose, finalFocusRef }): JSX.Element => {
  const { id } = useGuild()

  const toast = useToast()

  const { onSubmit, isLoading, isSigning, signLoadingText } = useCreateRole({
    onSuccess: () => {
      toast({
        title: "Role successfully created",
        status: "success",
      })
      onClose()
      methods.reset(defaultValues)
    },
  })

  const defaultValues: RoleToCreate = {
    guildId: id,
    name: "",
    description: "",
    logic: "AND",
    requirements: [
      {
        type: "FREE",
      },
    ],
    roleType: "NEW",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    visibility: Visibility.PUBLIC,
    rolePlatforms: [],
  }

  const methods = useForm<RoleFormType>({
    mode: "all",
    defaultValues,
  })

  /**
   * TODO: for some reason, isDirty was true & dirtyFields was an empty object and I
   * couldn't find the underlying problem, so used this workaround here, but we
   * should definitely find out what causes this strange behaviour!
   */
  const isDirty = Object.values(methods.formState.dirtyFields).length > 0
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
    fieldToSetOnSuccess: "imageUrl",
    fieldToSetOnError: "imageUrl",
    control: methods.control,
  })

  const drawerBodyRef = useRef<HTMLDivElement>()

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    methods.handleSubmit(onSubmit, (formErrors) => {
      if (formErrors.requirements && drawerBodyRef.current) {
        drawerBodyRef.current.scrollBy({
          top: drawerBodyRef.current.scrollHeight,
          behavior: "smooth",
        })
      }
    }),
    iconUploader.isUploading
  )

  const loadingText = signLoadingText || uploadLoadingText || "Saving data"

  const setVisibilityModalProps = useVisibilityModalProps()

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="left"
        size={{ base: "full", md: "lg" }}
        onClose={isDirty ? onAlertOpen : onClose}
        finalFocusRef={finalFocusRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody ref={drawerBodyRef} className="custom-scrollbar">
            <FormProvider {...methods}>
              <DrawerHeader
                title="Add role"
                justifyContent="start"
                spacing={1}
                alignItems="center"
              >
                <Box>
                  <SetVisibility
                    entityType="role"
                    defaultValues={{
                      visibility: methods.getValues("visibility"),
                      visibilityRoleId: methods.getValues("visibilityRoleId"),
                    }}
                    onSave={({ visibility, visibilityRoleId }) => {
                      methods.setValue("visibility", visibility)
                      methods.setValue("visibilityRoleId", visibilityRoleId)
                      setVisibilityModalProps.onClose()
                    }}
                    {...setVisibilityModalProps}
                  />
                </Box>
              </DrawerHeader>

              <VStack spacing={10} alignItems="start">
                <RolePlatforms />

                <Section title={"General"}>
                  <Box>
                    <FormLabel>Choose a logo and name for your role</FormLabel>
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
              isLoading={isLoading || isSigning || isUploadingShown}
              colorScheme="green"
              loadingText={loadingText}
              onClick={handleSubmit}
              data-test="save-role-button"
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

export default AddRoleDrawer
