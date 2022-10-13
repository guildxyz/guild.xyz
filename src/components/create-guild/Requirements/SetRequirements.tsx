import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import Card from "components/common/Card"
import { Modal } from "components/common/Modal"
import LogicDivider from "components/[guild]/LogicDivider"
import REQUIREMENT_CARDS from "components/[guild]/Requirements/requirementCards"
import { X } from "phosphor-react"
import { useEffect, useMemo } from "react"
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

type Props = {
  maxCols?: number
}

const SetRequirements = ({ maxCols = 2 }: Props): JSX.Element => {
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
  const logic = watch("logic")
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
    <>
      <LogicPicker />
      <FormControl isInvalid={!!errors.requirements?.message}>
        <HStack mb={2}>
          <FormLabel m="0" htmlFor="-">
            Requirements
          </FormLabel>
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
        </HStack>

        {!freeEntry && isMobile && <BalancyCounter />}
        <Stack
          position="relative"
          pb="20"
          spacing="0"
          divider={<LogicDivider logic={logic} border="0" />}
        >
          {controlledFields.map((field: Requirement, i) => {
            const type: RequirementType = getValues(`requirements.${i}.type`)
            const RequirementCard = REQUIREMENT_CARDS[type]

            if (RequirementCard) {
              return (
                <RequirementEditableCard
                  key={field.id}
                  type={type}
                  field={field}
                  index={i}
                  removeRequirement={removeRequirement}
                >
                  <RequirementCard requirement={field} />
                </RequirementEditableCard>
              )
            }
          })}

          <AddRequirementCard onAdd={addRequirement} />
        </Stack>

        <FormErrorMessage id="requirements-error-message">
          {errors.requirements?.message as string}
        </FormErrorMessage>
      </FormControl>
    </>
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

  return (
    <>
      <Card px="6" py="4">
        <HStack>
          {children}
          <Button size="sm" onClick={onOpen}>
            Edit
          </Button>
          <IconButton
            borderRadius={"full"}
            variant="ghost"
            icon={<Icon as={X} />}
            h="10"
            onClick={() => removeRequirement(index)}
            aria-label="Remove requirement"
          />
        </HStack>
      </Card>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
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
