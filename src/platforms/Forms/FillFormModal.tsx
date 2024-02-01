import {
  FormControl,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import FormFieldTitle from "components/[guild]/CreateFormModal/components/FormCardEditable/components/FormFieldTitle"
import { fieldTypes } from "components/[guild]/CreateFormModal/formConfig"
import { Form } from "components/[guild]/CreateFormModal/schemas"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Modal } from "components/common/Modal"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { PaperPlaneRight } from "phosphor-react"
import { Controller, useForm } from "react-hook-form"
import fetcher from "utils/fetcher"

type Props = {
  form: Form
  isOpen: boolean
  onClose: () => void
}

const FillFormModal = ({ form, isOpen, onClose }: Props) => {
  const { id } = useGuild()
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { onSubmit, isLoading } = useSubmitWithSign(
    (signedValidation) =>
      fetcher(`/v2/guilds/${id}/forms/${form.id}/user-submissions`, {
        ...signedValidation,
        method: "POST",
      }),
    {
      onSuccess: () =>
        toast({
          status: "success",
          title: "Successfully submitted form",
        }),
      onError: (error) => showErrorToast(error),
    }
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{form.name}</ModalHeader>
        <ModalCloseButton />

        <ModalBody pt={0}>
          <Stack spacing={8}>
            {form.description && <Text>{form.description}</Text>}

            {form.fields.map((field) => {
              const { DisplayComponent } = fieldTypes.find(
                (ft) => ft.value === field.type
              )

              return (
                <FormControl key={field.id} isInvalid={!!errors[field.id]}>
                  {/* TODO: should this be a simple FormLabel instead? */}
                  <FormFieldTitle field={field} mb={2} />
                  <Controller
                    control={control}
                    name={field.id}
                    rules={{
                      required: field.isRequired && "This field is required",
                    }}
                    render={({ field: controlledField }) => (
                      <DisplayComponent field={field} {...controlledField} />
                    )}
                  />

                  <FormErrorMessage>
                    {errors[field.id]?.message?.toString()}
                  </FormErrorMessage>
                </FormControl>
              )
            })}
          </Stack>

          <DynamicDevTool control={control} />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            rightIcon={<PaperPlaneRight />}
            isLoading={isLoading}
            onClick={handleSubmit(
              (data: Record<string, string>) =>
                onSubmit(
                  Object.entries(data).map(([fieldId, value]) => ({
                    fieldId,
                    value,
                  }))
                ),
              console.error
            )}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default FillFormModal
