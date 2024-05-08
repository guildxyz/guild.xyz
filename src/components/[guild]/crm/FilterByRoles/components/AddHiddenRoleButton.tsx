import {
  Box,
  Divider,
  FormLabel,
  HStack,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import { Plus } from "phosphor-react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { Visibility } from "types"
import getRandomInt from "utils/getRandomInt"
import SetHiddenRoleRequirements from "./SetHiddenRoleRequirements"
import useCreateHiddenRole from "./useCreateHiddenRole"

const AddHiddenRoleButton = (buttonProps) => {
  const { id } = useGuild()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const defaultValues = {
    guildId: id,
    name: "",
    description: "",
    logic: "AND",
    requirements: [],
    roleType: "NEW",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    visibility: Visibility.HIDDEN,
  }

  const methods = useForm({ mode: "all", defaultValues })

  const formRequirements = useWatch({
    name: "requirements",
    control: methods.control,
  })

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

  const onSuccess = () => {
    onClose()
    methods.reset(defaultValues)
  }
  const { onSubmit, isLoading, isSigning, signLoadingText } =
    useCreateHiddenRole(onSuccess)

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    (...props) => methods.handleSubmit(onSubmit)(...props),
    iconUploader.isUploading
  )

  const loadingText = signLoadingText || uploadLoadingText || "Saving role"

  return (
    <>
      <Button leftIcon={<Plus />} onClick={onOpen} size="sm" {...buttonProps}>
        Create new
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={methods.formState.isDirty ? onAlertOpen : onClose}
        size="xl"
        colorScheme="dark"
      >
        <ModalOverlay />
        <ModalContent>
          <FormProvider {...methods}>
            <ModalHeader>Create hidden role</ModalHeader>
            <ModalBody>
              <SetHiddenRoleRequirements />

              <Divider mt="8" />

              <Box mt="8">
                <FormLabel>Display as</FormLabel>
                <HStack spacing={2} alignItems="start">
                  <IconSelector uploader={iconUploader} />
                  <Name width="full" />
                </HStack>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" mr={3} onClick={onCloseAndClear}>
                Cancel
              </Button>
              <Button
                isLoading={isLoading || isSigning || isUploadingShown}
                colorScheme="green"
                loadingText={loadingText}
                onClick={handleSubmit}
                isDisabled={!(formRequirements?.length > 0)}
                data-test="save-role-button"
              >
                Save
              </Button>
            </ModalFooter>
          </FormProvider>
        </ModalContent>
      </Modal>
      <DiscardAlert
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        onDiscard={onCloseAndClear}
      />
    </>
  )
}

export default AddHiddenRoleButton
