import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  useDisclosure,
} from "@chakra-ui/react"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import { ReactNode } from "react"
import { useFormContext } from "react-hook-form"
import REQUIREMENTS from "requirements"
import { Requirement } from "types"
import IsNegatedPicker from "./IsNegatedPicker"

export type RequirementEditModalProps = {
  requirementField: Requirement
  footer: ReactNode
} & Pick<ModalProps, "isOpen" | "onClose" | "finalFocusRef">

const RequirementEditModal = ({
  requirementField,
  isOpen,
  onClose,
  finalFocusRef,
  footer,
}: RequirementEditModalProps) => {
  const {
    isOpen: isDiscardAlertOpen,
    onOpen: onDiscardAlertOpen,
    onClose: onDiscardAlertClose,
  } = useDisclosure()

  const {
    reset,
    formState: { isDirty },
  } = useFormContext()

  const onCloseAndClear = () => {
    reset()
    onDiscardAlertClose()
    onClose()
  }

  const FormComponent = REQUIREMENTS[requirementField.type].formComponent

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={isDirty ? onDiscardAlertOpen : onClose}
        scrollBehavior="inside"
        finalFocusRef={finalFocusRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            onClick={(e) => {
              e.preventDefault()
              onCloseAndClear()
            }}
          />
          <ModalHeader>{`Edit ${
            REQUIREMENTS[requirementField.type].name
          } requirement`}</ModalHeader>
          <ModalBody>
            {REQUIREMENTS[requirementField.type].isNegatable && (
              <IsNegatedPicker baseFieldPath={``} />
            )}
            {!!FormComponent && (
              <FormComponent baseFieldPath={""} field={requirementField} />
            )}
          </ModalBody>
          <ModalFooter gap="3">{footer}</ModalFooter>
        </ModalContent>
      </Modal>

      <DiscardAlert
        isOpen={isDiscardAlertOpen}
        onClose={onDiscardAlertClose}
        onDiscard={onCloseAndClear}
      />
    </>
  )
}
export default RequirementEditModal
