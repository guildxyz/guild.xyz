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
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useEffect, useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement, SelectOption } from "types"
import useJuicebox from "./hooks/useJuicebox"

type Props = {
  index: number
  field: Requirement
}

const JuiceboxFormCard = ({ index, field }: Props): JSX.Element => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  // Setting up a default address for now, it isn't editable in the UI
  useEffect(() => {
    setValue(
      `requirements.${index}.address`,
      "0xee2eBCcB7CDb34a8A822b589F9E8427C24351bfc"
    )
  }, [setValue])

  const id = useWatch({ name: `requirements.${index}.data.id` })

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

  const pickedProject = useMemo(
    () => mappedOptions?.find((project) => project.value === id),
    [id, mappedOptions]
  )

  return (
    <>
      <FormControl isRequired isInvalid={!!errors?.requirements?.[index]?.data?.id}>
        <FormLabel>Project:</FormLabel>

        <InputGroup>
          {id && (
            <InputLeftElement>
              <OptionImage img={pickedProject?.img} alt={pickedProject?.label} />
            </InputLeftElement>
          )}
          <Controller
            name={`requirements.${index}.data.id` as const}
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
                  onChange(selectedOption?.value)
                }
                onBlur={onBlur}
              />
            )}
          />
        </InputGroup>

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors?.requirements?.[index]?.data?.minAmount}>
        <FormLabel>Minimum amount staked:</FormLabel>

        <Controller
          name={`requirements.${index}.data.minAmount` as const}
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
          {errors?.requirements?.[index]?.data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default JuiceboxFormCard
