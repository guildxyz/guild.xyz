import {
  Button,
  Checkbox,
  CloseButton,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import Section from "components/common/Section"
import REQUIREMENT_CARDS from "components/[guild]/Requirements/requirementCards"
import { useEffect, useMemo, useRef } from "react"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { Requirement, RequirementType } from "types"
import AddRequirementCard from "./components/AddRequirementCard"
import BalancyCounter from "./components/BalancyCounter"
import BalancyFooter from "./components/BalancyFooter"
import REQUIREMENT_FORMCARDS from "./formCards"
import useAddRequirementsFromQuery from "./hooks/useAddRequirementsFromQuery"
import LogicPicker from "./LogicPicker"

const SetRequirements = (): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const { control, getValues, watch, clearErrors } = useFormContext()

  const { fields, append, replace, remove, update } = useFieldArray({
    name: "requirements",
    control,
  })

  const requirements = useWatch({ name: "requirements" })

  useEffect(() => {
    if (!requirements || requirements?.length === 0) {
      // setError("requirements", {
      //   message: "Set some requirements, or make the role free",
      // })
    } else {
      clearErrors("requirements")
    }
  }, [requirements])

  useAddRequirementsFromQuery(append)

  const addRequirement = (data) => {
    append(data)

    // Sending actions to datadog
    addDatadogAction("Added a requirement")
    addDatadogAction(`Added a requirement [${data.type}]`)
  }

  // Watching the nested fields too, so we can properly update the list
  const watchFieldArray = watch("requirements")
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }))

  const freeEntry = useMemo(
    () => !!controlledFields?.find((requirement) => requirement.type === "FREE"),
    [controlledFields]
  )

  const onFreeEntryChange = (e) =>
    e.target.checked
      ? replace([{ type: "FREE", data: {}, chain: null, address: null }])
      : replace([])

  const isMobile = useBreakpointValue({ base: true, sm: false })

  return (
    <Section
      title="Requirements"
      titleRightElement={
        <>
          <Text as="span" fontWeight="normal" fontSize="sm" color="gray">
            {`- or `}
          </Text>
          <Checkbox
            id="free-entry-checkbox"
            flexGrow={0}
            fontWeight="normal"
            size="sm"
            spacing={1}
            defaultChecked={freeEntry}
            onChange={onFreeEntryChange}
            isInvalid={false}
          >
            Free entry
          </Checkbox>
          {!freeEntry && !isMobile && <BalancyCounter ml="auto !important" />}
        </>
      }
      spacing={0}
    >
      {!freeEntry && isMobile && <BalancyCounter mb="6" />}
      {controlledFields.map((field: Requirement, i) => {
        const type: RequirementType = getValues(`requirements.${i}.type`)
        const RequirementCard = REQUIREMENT_CARDS[type]

        if (type === "FREE")
          return (
            <CardMotionWrapper>
              <Card px="6" py="4">
                <RequirementCard />
              </Card>
            </CardMotionWrapper>
          )

        if (RequirementCard) {
          return (
            <CardMotionWrapper key={field.id}>
              <RequirementEditableCard
                type={type}
                field={field}
                index={i}
                removeRequirement={remove}
                updateRequirement={update}
              >
                <RequirementCard
                  requirement={field}
                  footer={<BalancyFooter baseFieldPath={`requirements.${i}`} />}
                />
              </RequirementEditableCard>
              <LogicPicker />
            </CardMotionWrapper>
          )
        }
      })}

      {!freeEntry && <AddRequirementCard onAdd={addRequirement} />}

      {/* <FormErrorMessage id="requirements-error-message">
        {errors.requirements?.message as string}
      </FormErrorMessage> */}
    </Section>
  )
}

const RequirementEditableCard = ({
  index,
  type,
  field,
  removeRequirement,
  updateRequirement,
  children,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
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

  return (
    <>
      <Card px="6" py="4" pos="relative">
        <HStack pr="3">
          {children}
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
            <ModalHeader>Edit requirement</ModalHeader>
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

export default SetRequirements
