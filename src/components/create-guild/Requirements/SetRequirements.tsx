import {
  Button,
  Checkbox,
  HStack,
  Icon,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Modal } from "components/common/Modal"
import Section from "components/common/Section"
import REQUIREMENT_CARDS from "components/[guild]/Requirements/requirementCards"
import { X } from "phosphor-react"
import { useEffect, useMemo, useRef } from "react"
import {
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import { Requirement, RequirementType } from "types"
import LogicPicker from "../LogicPicker"
import AddRequirementCard from "./components/AddRequirementCard"
import BalancyCounter from "./components/BalancyCounter"
import REQUIREMENT_FORMCARDS from "./formCards"
import useAddRequirementsFromQuery from "./hooks/useAddRequirementsFromQuery"

const SetRequirements = (): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const { control, getValues, setValue, watch, clearErrors, setError } =
    useFormContext()

  const { errors } = useFormState()

  /**
   * TODO: UseFieldArrays's remove function doesn't work correctly with
   * AnimatePresence for some reason, so as workaround we don't remove fields, just
   * set their type to `null` and filter them out at submit
   */
  const { fields, append, replace } = useFieldArray({
    name: "requirements",
    control,
  })

  const requirements = useWatch({ name: "requirements" })

  useEffect(() => {
    if (
      !requirements ||
      requirements?.length === 0 ||
      requirements?.every(({ type }) => !type)
    ) {
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

  const removeRequirement = (index: number) => {
    setValue(`requirements.${index}.type`, null)
    clearErrors(`requirements.${index}`)
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
      {!freeEntry && isMobile && <BalancyCounter />}
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
                removeRequirement={removeRequirement}
              >
                <RequirementCard requirement={field} />
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
  children,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const FormComponent = REQUIREMENT_FORMCARDS[type]
  const ref = useRef()

  return (
    <>
      <Card px="6" py="4">
        <HStack>
          {children}
          <Button ref={ref} size="sm" onClick={onOpen}>
            Edit
          </Button>
          <IconButton
            borderRadius={"full"}
            variant="ghost"
            icon={<Icon as={X} />}
            size="sm"
            onClick={() => removeRequirement(index)}
            aria-label="Remove requirement"
          />
        </HStack>
      </Card>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        finalFocusRef={ref}
        // colorScheme={"dark"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Edit requirement</ModalHeader>
          <ModalBody>
            <VStack spacing={4} alignItems="start">
              <FormComponent
                baseFieldPath={`requirements.${index}.`}
                field={field}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme={"green"} onClick={onClose}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SetRequirements
