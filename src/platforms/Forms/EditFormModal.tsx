import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import CreateFormForm from "components/[guild]/CreateFormModal/components/CreateFormForm"
import {
  Form,
  FormCreationFormSchema,
} from "components/[guild]/CreateFormModal/schemas"
import { CreateForm } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useToast from "hooks/useToast"
import { FormProvider, useForm } from "react-hook-form"
import { uuidv7 } from "uuidv7"
import { z } from "zod"
import useEditForm from "./hooks/useEditForm"

type Props = {
  isOpen: boolean
  onClose: () => void
  form: Form
}

const EditFormModal = ({ isOpen, onClose, form }: Props) => {
  const methods = useForm<z.input<typeof FormCreationFormSchema>>({
    mode: "all",
    resolver: zodResolver(FormCreationFormSchema),
    defaultValues: {
      ...form,
      fields: form.fields.map((field) => {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" colorScheme="dark">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit form</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...methods}>
            <Stack spacing={8}>
              <CreateFormForm />

              <Button
                colorScheme="green"
                w="max-content"
                ml="auto"
                onClick={methods.handleSubmit(onEditFormSubmit, console.error)}
                isLoading={isLoading}
                loadingText="Saving form"
              >
                Save
              </Button>
            </Stack>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
export default EditFormModal
