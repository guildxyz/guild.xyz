import {
  Button,
  CloseButton,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement from "components/[guild]/Requirements/components/Requirement"
import { RequirementProvider } from "components/[guild]/Requirements/components/RequirementContext"
import { Warning } from "phosphor-react"
import { useCallback, useRef } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import REQUIREMENTS from "requirements"
import BalancyFooter from "./BalancyFooter"
import IsNegatedPicker from "./IsNegatedPicker"

const RequirementEditableCard = ({
  index,
  type,
  field,
  removeRequirement,
  updateRequirement,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const RequirementComponent = REQUIREMENTS[type]?.displayComponent
  const FormComponent = REQUIREMENTS[type]?.formComponent
  const ref = useRef()
  const removeButtonColor = useColorModeValue("gray.700", "gray.400")
  const methods = useForm({ mode: "all", defaultValues: field })

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const onCloseAndClear = () => {
    methods.reset()
    onAlertClose()
    onClose()
  }

  const onSubmit = methods.handleSubmit((data) => {
    updateRequirement(index, data)
    methods.reset(undefined, { keepValues: true })
    onClose()
  })

  // temporary to set values for balancy so it works without opening the edit modal
  const { setValue } = useFormContext()
  const setValueForBalancy = useCallback(
    (path, data) => {
      setValue(`requirements.${index}.${path}`, data)
    },
    [index, setValue]
  )

  if (!RequirementComponent || !FormComponent)
    return (
      <Card px="6" py="4" pr="8" pos="relative">
        <Requirement image={<Icon as={Warning} boxSize={5} color="orange.300" />}>
          {`Unsupported requirement type: `}
          <DataBlock>{type}</DataBlock>
        </Requirement>

        <CloseButton
          position="absolute"
          top={2}
          right={2}
          color={removeButtonColor}
          borderRadius={"full"}
          size="sm"
          onClick={() => removeRequirement(index)}
          aria-label="Remove requirement"
        />
      </Card>
    )

  return (
    <>
      <Card px="6" py="4" pr="8" pos="relative">
        <RequirementProvider requirement={field}>
          <RequirementComponent
            footer={<BalancyFooter baseFieldPath={`requirements.${index}`} />}
            setValueForBalancy={setValueForBalancy}
            rightElement={
              <Button ref={ref} size="sm" onClick={onOpen}>
                Edit
              </Button>
            }
          />
        </RequirementProvider>

        <CloseButton
          position="absolute"
          top={2}
          right={2}
          color={removeButtonColor}
          borderRadius={"full"}
          size="sm"
          onClick={() => removeRequirement(index)}
          aria-label="Remove requirement"
        />
      </Card>
      <Modal
        isOpen={isOpen}
        onClose={methods.formState.isDirty ? onAlertOpen : onClose}
        scrollBehavior="inside"
        finalFocusRef={ref}
        // colorScheme={"dark"}
      >
        <ModalOverlay />
        <ModalContent>
          <FormProvider {...methods}>
            <ModalCloseButton
              onClick={(e) => {
                e.preventDefault()
                onCloseAndClear()
              }}
            />
            <ModalHeader>{`Edit ${REQUIREMENTS[type].name} requirement`}</ModalHeader>
            <ModalBody>
              <IsNegatedPicker baseFieldPath={``} />
              <FormComponent baseFieldPath={``} field={field} />
            </ModalBody>
            <ModalFooter gap="3">
              <BalancyFooter baseFieldPath={null} />
              <Button colorScheme={"green"} onClick={onSubmit} ml="auto">
                Done
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

export default RequirementEditableCard
