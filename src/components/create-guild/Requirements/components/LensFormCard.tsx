import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Controller, useFormContext } from "react-hook-form"
import { Requirement, SelectOption } from "types"

type Props = {
  index: number
  field: Requirement
}

const options = [
  { label: "First option", value: "first" },
  { label: "Second option", value: "second" },
]

const LensFormCard = ({ index, field }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <FormControl isRequired>
        <FormLabel>Type:</FormLabel>

        <Controller
          name={`requirements.${index}.data.id` as const}
          control={control}
          defaultValue={field.data?.id ?? ""}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              options={options}
              value={options?.find((option) => option.value === value) ?? ""}
              placeholder="Choose..."
              onChange={(newSelectedOption: SelectOption) => {
                onChange(newSelectedOption?.value)
              }}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default LensFormCard
