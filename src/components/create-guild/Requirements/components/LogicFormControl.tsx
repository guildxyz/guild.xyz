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
import pluralize from "utils/pluralize"

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
    field: { onChange: anyOfNumOnChange, value: anyOfNum, ...anyOfNumFieldProps },
  } = useController({
    name: "anyOfNum",
    defaultValue: 1,
    // rules: {
    //   required: logic !== "AND" && "This field is required",
    //   min: {
    //     value: 1,
    //     message: "Minimum value is 1",
    //   },
    //   max: {
    //     value: Math.max(requirementCount - 1, 1),
    //     message: "Must be less than the number of requirements",
    //   },
    // },
  })

  // useEffect(() => {
  //   if (!isDirty || logic === "AND") return
  //
  //   if (anyOfNum === requirementCount)
  //     anyOfNumOnChange(Math.max(requirementCount - 1, 1))
  //
  //   if (requirementCount < prevRequirementCount && requirementCount <= 2)
  //     logicOnChange("OR")
  // }, [
  //   isDirty,
  //   logic,
  //   anyOfNum,
  //   requirementCount,
  //   anyOfNumOnChange,
  //   prevRequirementCount,
  //   logicOnChange,
  // ])

  return (
    <Stack alignItems="start" direction={{ base: "column", sm: "row" }}>
      <Text as="span" flexShrink={0} pt={2}>
        Should meet
      </Text>
      <Select
        w={{ base: "full", sm: "20" }}
        flexShrink={0}
        onChange={(e) => {
          switch (e.target.value) {
            case "0": {
              logicOnChange("AND")
              anyOfNumOnChange(1)
              break
            }
            case "1": {
              logicOnChange("OR")
              anyOfNumOnChange(parseInt(e.target.value))
              break
            }
            default: {
              logicOnChange("ANY_OF")
              anyOfNumOnChange(parseInt(e.target.value))
              break
            }
          }
        }}
        defaultValue={(anyOfNum || logic === "AND" ? 0 : 1).toString()}
      >
        {Array.from({ length: requirementCount }, (_, i) => (
          <option value={i.toString()} key={i}>
            {i ? i : "All"}
          </option>
        ))}
      </Select>

      <HStack alignItems="start" pt="px">
        <Text as="span" flexShrink={0} pt={2}>
          {pluralize(requirementCount, "requirement", false)} out of{" "}
          {requirementCount}
        </Text>
      </HStack>
    </Stack>
  )
}

export default LogicFormControl

// <NumberInput
//   w={28}
//   position="relative"
//   top={-0.5}
//   {...anyOfNumFieldProps}
//   onChange={(_, valueAsNumber) => {
//     if (!isNaN(valueAsNumber)) {
//       anyOfNumOnChange(valueAsNumber)
//
//       logicOnChange(
//         valueAsNumber === 1 || valueAsNumber === requirementCount
//           ? "OR"
//           : "ANY_OF"
//       )
//     } else {
//       anyOfNumOnChange("")
//     }
//   }}
//   value={value ?? ""}
//   min={1}
//   max={Math.max(requirementCount - 1, 1)}
// >
//   <NumberInputField />
//   <NumberInputStepper>
//     <NumberIncrementStepper />
//     <NumberDecrementStepper />
//   </NumberInputStepper>
// </NumberInput>
// <FormControl isInvalid={!!errors?.anyOfNum}>
//   <FormErrorMessage>
//     {errors?.anyOfNum?.message?.toString()}
//   </FormErrorMessage>
// </FormControl>
