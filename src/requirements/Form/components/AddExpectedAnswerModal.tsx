import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react"
import { fieldTypes } from "components/[guild]/CreateFormModal/formConfig"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { FormProvider, useForm } from "react-hook-form"
import QuestionSelector from "./QuestionSelector"

const AddExpectedAnswerModal = ({
  isOpen,
  onClose,
  formId,
  alreadyAddedFields,
  onAdd,
}) => {
  const methods = useForm()
  const { form } = useGuildForm(formId)

  const selectedFieldId = methods.watch(`fieldId`)

  const field = form?.fields?.find((f) => f.id === selectedFieldId)
  const selectedFieldType = fieldTypes.find((ft) => ft.value === field?.type)

  const onSuccess = (data) => {
    onAdd(data)
    methods.reset()
    onClose()
  }

  return (
    <Modal {...{ isOpen, onClose }}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Add expected answer</ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <Stack spacing={4}>
              <QuestionSelector
                formId={formId}
                disabledQuestions={alreadyAddedFields}
              />
              {selectedFieldType && (
                <selectedFieldType.ExpectedAnswerComponent field={field} />
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={methods.handleSubmit(onSuccess)} colorScheme="green">
              Add
            </Button>
          </ModalFooter>
        </FormProvider>
      </ModalContent>
    </Modal>
  )
}

export default AddExpectedAnswerModal
