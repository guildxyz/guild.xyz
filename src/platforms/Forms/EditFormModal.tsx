import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react"
import CreateFormForm from "components/[guild]/CreateFormModal/components/CreateFormForm"
import {
  CreateFormParams,
  FieldFromDBSchema,
  Form,
  FormSchema,
} from "components/[guild]/CreateFormModal/schemas"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useToast from "hooks/useToast"
import { FormProvider, useForm } from "react-hook-form"
import { uuidv7 } from "uuidv7"
import { z } from "zod"
import useEditForm from "./hooks/useEditForm"

const EditFormSchema = FormSchema.extend({
  fields: z.array(
    FieldFromDBSchema.transform((field) => {
      if (
        field.type === "LONG_TEXT" ||
        field.type === "SHORT_TEXT" ||
        field.type === "NUMBER"
      )
        return field

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
    })
  ),
})

type Props = {
  isOpen: boolean
  onClose: () => void
  form: Form
}

const EditFormModal = ({ isOpen, onClose, form }: Props) => {
  const methods = useForm<CreateFormParams>({
    mode: "all",
    defaultValues: EditFormSchema.parse(form),
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

  const onEditFormSubmit = (data: CreateFormParams) =>
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
        <ModalHeader>Edit points</ModalHeader>
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
