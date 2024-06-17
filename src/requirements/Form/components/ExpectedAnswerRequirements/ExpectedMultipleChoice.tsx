import { FormControl, FormLabel, HStack, Stack, Text } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import RadioButtonGroup from "components/common/RadioButtonGroup"
import { Check, Minus, X } from "phosphor-react"
import { useFieldArray, useFormContext, useFormState } from "react-hook-form"

export const ExpectedMultipleChoice = ({ field }) => {
  const { getValues } = useFormContext()
  const { errors } = useFormState()

  const acceptedAnswers = useFieldArray({ name: `acceptedAnswers` })
  const rejectedAnswers = useFieldArray({ name: `rejectedAnswers` })

  const findIndexInArray = (fieldName, option) =>
    getValues(fieldName)?.findIndex((f) => f === option.toString())

  const onChange = (option, newValue: "include" | "exclude" | "ignore") => {
    const acceptedIndex = findIndexInArray("acceptedAnswers", option)
    const rejectedIndex = findIndexInArray("rejectedAnswers", option)
    if (acceptedIndex > -1) acceptedAnswers.remove(acceptedIndex)
    if (rejectedIndex > -1) rejectedAnswers.remove(rejectedIndex)

    if (newValue === "include") acceptedAnswers.append(option)
    if (newValue === "exclude") rejectedAnswers.append(option)
  }

  return (
    <FormControl isInvalid={!!errors?.acceptedAnswers}>
      <FormLabel>Options to select</FormLabel>

      <Stack spacing={1}>
        {field?.options?.map((option) => (
          <ExpectedChoice
            key={option}
            option={option.toString()}
            value={
              findIndexInArray("acceptedAnswers", option) > -1
                ? "include"
                : findIndexInArray("rejectedAnswers", option) > -1
                ? "exclude"
                : null
            }
            onChange={(newValue) => onChange(option, newValue)}
          ></ExpectedChoice>
        ))}
      </Stack>

      <FormErrorMessage>
        {errors?.acceptedAnswers?.root?.message as string}
      </FormErrorMessage>
    </FormControl>
  )
}

const options = [
  {
    label: <Check />,
    value: "include",
    colorScheme: "green",
    tooltipLabel: "Must be selected",
  },
  {
    label: <Minus />,
    value: "ignore",
  },
  {
    label: <X />,
    value: "exclude",
    colorScheme: "red",
    tooltipLabel: "Must not be selected",
  },
]

const ExpectedChoice = ({ option, value, onChange }) => (
  <HStack>
    <RadioButtonGroup
      options={options}
      onChange={onChange}
      value={value}
      chakraStyles={{ size: "xs", isAttached: true, variant: "outline" }}
    ></RadioButtonGroup>
    <Text>{option}</Text>
  </HStack>
)
