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
import { ClientStateRequirementHandlerProvider } from "components/[guild]/RequirementHandlerContext"
import AddRolePlatforms from "components/[guild]/RolePlatforms/AddRolePlatforms"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import SetRequirements from "components/create-guild/Requirements"
import useCreateRRR, { defaultFeedbackConfigRRR } from "hooks/useCreateRRR"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useToast from "hooks/useToast"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useRef } from "react"
import { FormProvider } from "react-hook-form"
import useAddRoleForm from "../hooks/useAddRoleForm"
import AddRoleDrawerHeader from "./AddRoleDrawerHeader"

const AddRoleDrawer = ({ isOpen, onClose, finalFocusRef }): JSX.Element => {
  const methods = useAddRoleForm()

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
    methods.reset(methods.defaultValues)
    onAlertClose()
    onClose()
  }

  const iconUploader = usePinata({
    fieldToSetOnSuccess: "imageUrl",
    fieldToSetOnError: "imageUrl",
    control: methods.control,
  })

  const drawerBodyRef = useRef<HTMLDivElement>()
  const toast = useToast()

  const { onSubmit, isLoading, loadingText } = useCreateRRR({
    onSuccess: () => {
      toast({
        title: "Role successfully created!",
        status: "success",
      })
      methods.reset(methods.defaultValues)
      onClose()
    },
    feedbackConfig: {
      ...defaultFeedbackConfigRRR,
      createRRR: {
        showConfetti: true,
        showToast: {
          onError: true,
          onSuccess: false,
        },
      },
    },
  })

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
              <ClientStateRequirementHandlerProvider methods={methods}>
                <AddRoleDrawerHeader />
                <VStack spacing={10} alignItems="start">
                  <AddRolePlatforms />

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
              </ClientStateRequirementHandlerProvider>
            </FormProvider>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onCloseAndClear}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading || isUploadingShown}
              colorScheme="green"
              loadingText={loadingText || uploadLoadingText}
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
