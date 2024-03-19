import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import CreateFormForm from "components/[guild]/CreateFormModal/components/CreateFormForm"
import { FormCreationSchema } from "components/[guild]/CreateFormModal/schemas"
import { CreateForm } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import useToast from "hooks/useToast"
import { FormProvider, useForm } from "react-hook-form"
import { uuidv7 } from "uuidv7"
import { z } from "zod"
import useEditForm from "./hooks/useEditForm"

type Props = {
  isOpen: boolean
  onClose: () => void
  form: Schemas["Form"]
}

const EditFormModal = ({ isOpen, onClose, form }: Props) => {
  const methods = useForm<z.input<typeof FormCreationSchema>>({
    mode: "all",
    resolver: zodResolver(FormCreationSchema),
    defaultValues: {
      ...form,
      fields: form.fields?.map((field) => {
        if (
          field.type === "SINGLE_CHOICE" ||
          field.type === "MULTIPLE_CHOICE" ||
          field.type === "RATE"
        ) {
          return {
            ...field,
            options: field.options.map((option) => ({
              value: option,
            })),
          }
        }

        return field
      }),
    },
  })

  const {
    isOpen: isDiscardAlertOpen,
    onOpen: onDiscardAlertOpen,
    onClose: onDiscardAlertClose,
  } = useDisclosure()

  const toast = useToast()
  const { onSubmit, isLoading } = useEditForm({
    formId: form.id,
    onSuccess: () => {
      toast({
        status: "success",
        title: "Successfully updated form",
      })
      onClose()
    },
  })

  const onEditFormSubmit = (data: CreateForm) =>
    onSubmit({
      ...data,
      fields: data.fields.map((field) => ({
        ...field,
        ...(field.id ? undefined : { id: uuidv7() }),
      })),
    })

  const boxShadow = useColorModeValue(
    "0 -4px 6px -1px rgba(0, 0, 0, 0.1),0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
    "0 -10px 15px -3px rgba(0, 0, 0, 0.1),0 -4px 6px -2px rgba(0, 0, 0, 0.05)",
  )

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={methods.formState.isDirty ? onDiscardAlertOpen : onClose}
        size="4xl"
        colorScheme="dark"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxH="100vh !important">
          <ModalHeader>Edit form</ModalHeader>
          <ModalCloseButton />
          <FormProvider {...methods}>
            <ModalBody>
              <CreateFormForm />
            </ModalBody>
            <ModalFooter py="4" boxShadow={boxShadow} zIndex={1}>
              <Button
                onClick={() => {
                  methods.reset()
                  onClose()
                }}
                ml="auto"
              >
                Cancel
              </Button>
              <Button
                colorScheme="green"
                isDisabled={!methods.formState.isDirty}
                w="max-content"
                ml={2}
                onClick={methods.handleSubmit(onEditFormSubmit, console.error)}
                isLoading={isLoading}
                loadingText="Saving form"
              >
                Save
              </Button>
            </ModalFooter>
          </FormProvider>
        </ModalContent>
      </Modal>

      <DiscardAlert
        isOpen={isDiscardAlertOpen}
        onClose={onDiscardAlertClose}
        onDiscard={() => {
          methods.reset()
          onDiscardAlertClose()
          onClose()
        }}
      />
    </>
  )
}
export default EditFormModal
