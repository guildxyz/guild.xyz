import {
  FormControl,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Text,
  useBreakpointValue,
  usePrevious,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useEffect } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { Requirement } from "types"

type Props = {
  requirements?: Requirement[]
}

const LogicFormControl = ({
  requirements: requirementsFromProps,
}: Props): JSX.Element => {
  const {
    resetField,
    formState: { isDirty, errors },
  } = useFormContext()

  const requirementsFromFormContext = useWatch({ name: "requirements" })

  const requirements = requirementsFromProps || requirementsFromFormContext

  const requirementCount = requirements?.length ?? 0
  const prevRequirementCount = usePrevious(requirementCount)

  const {
    field: { onChange: logicOnChange, value: logic },
  } = useController({
    name: "logic",
    defaultValue: "AND",
  })

  const {
    field: { onChange: anyOfNumOnChange, value, ...anyOfNumFieldProps },
  } = useController({
    name: "anyOfNum",
    defaultValue: 1,
    rules: {
      required: logic !== "AND" && "This field is required",
      min: {
        value: 1,
        message: "Minimum value is 1",
      },
      max: {
        value: Math.max(requirementCount - 1, 1),
        message: "Must be less than the number of requirements",
      },
    },
  })

  const shouldSatisfyLabel = useBreakpointValue(
    {
      base: "should satisfy at least",
      sm: "at least",
      md: "should satisfy at least",
    },
    "md"
  )

  useEffect(() => {
    if (!isDirty || logic === "AND") return

    if (value === requirementCount)
      anyOfNumOnChange(Math.max(requirementCount - 1, 1))

    if (requirementCount < prevRequirementCount && requirementCount <= 2)
      logicOnChange("OR")
  }, [
    isDirty,
    logic,
    value,
    requirementCount,
    anyOfNumOnChange,
    prevRequirementCount,
    logicOnChange,
  ])

  return (
    <Stack alignItems="start" direction={{ base: "column", sm: "row" }}>
      <Select
        w={{ base: "full", sm: "52" }}
        flexShrink={0}
        onChange={(e) => {
          const newValue = e.target.value

          if (newValue === "OR" && value > 1) {
            logicOnChange("ANY_OF")
            resetField("anyOfNum", { defaultValue: 1 })
            return
          }

          logicOnChange(newValue)
          resetField("anyOfNum", { defaultValue: 1 })
        }}
        defaultValue={logic === "AND" ? "AND" : "OR"}
      >
        <option value="AND">Should satisfy all</option>
        <option value="OR">Should satisfy some</option>
      </Select>

      {logic !== "AND" && (
        <HStack alignItems="start" pt="px">
          <Text as="span" flexShrink={0} pt={2}>
            {shouldSatisfyLabel}
          </Text>
          <FormControl isInvalid={!!errors?.anyOfNum}>
            <NumberInput
              w={28}
              position="relative"
              top={-0.5}
              {...anyOfNumFieldProps}
              onChange={(_, valueAsNumber) => {
                if (!isNaN(valueAsNumber)) {
                  anyOfNumOnChange(valueAsNumber)

                  logicOnChange(
                    valueAsNumber === 1 || valueAsNumber === requirementCount
                      ? "OR"
                      : "ANY_OF"
                  )
                } else {
                  anyOfNumOnChange("")
                }
              }}
              value={value ?? ""}
              min={1}
              max={Math.max(requirementCount - 1, 1)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <FormErrorMessage>
              {errors?.anyOfNum?.message?.toString()}
            </FormErrorMessage>
          </FormControl>
        </HStack>
      )}
    </Stack>
  )
}

export default LogicFormControl
