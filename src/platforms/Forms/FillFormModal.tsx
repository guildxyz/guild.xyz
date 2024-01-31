import {
  ModalBody,
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
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { PaperPlaneRight } from "phosphor-react"

type Props = {
  form: Form
  isOpen: boolean
  onClose: () => void
}

const FillFormModal = ({ form, isOpen, onClose }: Props) => (
  <Modal isOpen={isOpen} onClose={onClose} size="2xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{form.name}</ModalHeader>

      <ModalBody pt={0}>
        <Stack spacing={8}>
          {form.description && <Text>{form.description}</Text>}

          {form.fields.map((field) => {
            const { DisplayComponent } = fieldTypes.find(
              (ft) => ft.value === field.type
            )
            return (
              <Stack key={field.id} spacing={2}>
                <FormFieldTitle field={field} />
                <DisplayComponent field={field} />
              </Stack>
            )
          })}
        </Stack>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="green" rightIcon={<PaperPlaneRight />}>
          Submit
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)

export default FillFormModal
