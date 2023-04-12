import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useDebouncedState from "hooks/useDebouncedState"
import { useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import { useJuicebox } from "./hooks/useJuicebox"

const JuiceboxForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const id = useWatch({ name: `${baseFieldPath}.data.id` })

  const [searchText, setSearchText] = useState("")
  const debouncedSearchText = useDebouncedState(searchText)
  const { projects, isLoading } = useJuicebox(debouncedSearchText)
  const mappedOptions = useMemo(
    () =>
      projects?.map((project) => ({
        img: project.logoUri,
        label: project.name,
        value: project.id,
      })),
    [projects]
  )

  const pickedProject = mappedOptions?.find((project) => project.value === id)

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>Project:</FormLabel>

        <InputGroup>
          {id && (
            <InputLeftElement>
              <OptionImage img={pickedProject?.img} alt={pickedProject?.label} />
            </InputLeftElement>
          )}
          <ControlledSelect
            name={`${baseFieldPath}.data.id`}
            rules={{
              required: "This field is required.",
            }}
            isClearable
            isLoading={isLoading}
            options={mappedOptions}
            placeholder="Search..."
            onInputChange={(text, _) => setSearchText(text)}
            noResultText={
              !debouncedSearchText.length ? "Start typing..." : undefined
            }
          />
        </InputGroup>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
      >
        <FormLabel>Minimum amount staked:</FormLabel>

        <Controller
          name={`${baseFieldPath}.data.minAmount` as const}
          control={control}
          rules={{
            required: "This field is required.",
            min: {
              value: 0,
              message: "Amount must be positive",
            },
          }}
          render={({
            field: { onChange, onBlur, value: numberInputValue, ref },
          }) => (
            <NumberInput
              ref={ref}
              value={numberInputValue}
              onChange={(newValue) => {
                const parsedValue = parseInt(newValue)
                onChange(isNaN(parsedValue) ? "" : parsedValue)
              }}
              onBlur={onBlur}
              min={0}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default JuiceboxForm
