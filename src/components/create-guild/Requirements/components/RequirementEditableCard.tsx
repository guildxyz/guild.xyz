import {
  Button,
  CloseButton,
  HStack,
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
import { getRequirementLabel } from "components/create-guild/Requirements/formCards"
import REQUIREMENT_CARDS from "components/[guild]/Requirements/requirementCards"
import { useCallback, useRef } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import REQUIREMENT_FORMCARDS from "../formCards"
import BalancyFooter from "./BalancyFooter"

const RequirementEditableCard = ({
  index,
  type,
  field,
  removeRequirement,
  updateRequirement,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const RequirementCardComponent = REQUIREMENT_CARDS[type]
  const FormComponent = REQUIREMENT_FORMCARDS[type]
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

  if (!RequirementCardComponent || !FormComponent) return null

  return (
    <>
      <Card px="6" py="4" pos="relative">
        <HStack pr="3">
          <RequirementCardComponent
            requirement={field}
            footer={<BalancyFooter baseFieldPath={`requirements.${index}`} />}
            setValueForBalancy={setValueForBalancy}
          />
          <Button ref={ref} size="sm" onClick={onOpen}>
            Edit
          </Button>
        </HStack>
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
            <ModalHeader>{`Edit ${getRequirementLabel(
              type
            )} requirement`}</ModalHeader>
            <ModalBody>
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
