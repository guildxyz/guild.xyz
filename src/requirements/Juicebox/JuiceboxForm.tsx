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
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useEffect, useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import { useJuicebox } from "./hooks/useJuicebox"

const JuiceboxForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext()

  // Setting up a default address for now, it isn't editable in the UI
  useEffect(() => {
    setValue(
      `${baseFieldPath}.address`,
      "0xee2eBCcB7CDb34a8A822b589F9E8427C24351bfc"
    )
  }, [setValue])

  const id = useWatch({ name: `${baseFieldPath}.data.id` })

  const { projects, isLoading } = useJuicebox()
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
          <Controller
            name={`${baseFieldPath}.data.id` as const}
            control={control}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value: selectValue, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                isLoading={isLoading}
                options={mappedOptions}
                placeholder="Search..."
                value={mappedOptions?.find((option) => option.value === selectValue)}
                onChange={(selectedOption: SelectOption) =>
                  onChange(selectedOption?.value ?? null)
                }
                onBlur={onBlur}
              />
            )}
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
