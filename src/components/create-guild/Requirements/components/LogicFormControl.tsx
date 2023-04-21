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
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useEffect } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"

const LogicFormControl = (): JSX.Element => {
  const {
    resetField,
    formState: { errors },
  } = useFormContext()

  const requirements = useWatch({ name: "requirements" })
  const requirementCount = requirements?.length ?? 0

  const {
    field: { onChange: logicOnChange, value: logic },
  } = useController({
    name: "logic",
    defaultValue: "AND",
  })

  const {
    field: { onChange: anyOfNumOnChange, ...anyOfNumFieldProps },
  } = useController({
    name: "anyOfNum",
    defaultValue: 1,
    rules: {
      required: "This field is required",
      min: {
        value: 1,
        message: "Minimum value is 1",
      },
      max: {
        value: requirementCount - 1,
        message: "Must be less than requirement count",
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
    if (logic === "AND") return

    if (
      anyOfNumFieldProps.value === 1 ||
      requirementCount === anyOfNumFieldProps.value
    ) {
      logicOnChange("OR")
      return
    }

    if (requirementCount > anyOfNumFieldProps.value) logicOnChange("ANY_OF")
  }, [requirementCount, anyOfNumFieldProps.value])

  return (
    <Stack alignItems="start" direction={{ base: "column", sm: "row" }}>
      <Select
        w={{ base: "full", sm: "52" }}
        flexShrink={0}
        onChange={(e) => {
          const newValue = e.target.value

          if (newValue === "OR" && anyOfNumFieldProps.value > 1) {
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
              onChange={(_, valueAsNumber) =>
                anyOfNumOnChange(!isNaN(valueAsNumber) ? valueAsNumber : "")
              }
              min={1}
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
