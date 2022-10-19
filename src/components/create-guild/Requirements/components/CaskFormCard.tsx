import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext } from "react-hook-form"
import { Requirement } from "types"

type Props = {
  index: number
  field: Requirement
}

const options = [
  { label: "First option", value: "first" },
  { label: "Second option", value: "second" },
]

const CaskFormCard = ({ index, field }: Props) => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext()

  return (
    <>
      <FormControl>
        <FormLabel>ID:</FormLabel>

        <Controller
          name={`requirements.${index}.data.id` as const}
          control={control}
          defaultValue={field.data?.id ?? ""}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              value={value ?? ""}
              placeholder="Optional"
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Provider:</FormLabel>

        <Controller
          name={`requirements.${index}.data.params.0.value`}
          control={control}
          defaultValue={field.data?.id ?? ""}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              value={value ?? ""}
              placeholder="Optional"
              onChange={(newChange) => {
                onChange(newChange)
                setValue(
                  `requirements.${index}.data.params.0.trait_type`,
                  "provider"
                )
              }}
              onBlur={onBlur}
            />
            // <StyledSelect
            //   ref={ref}
            //   isClearable
            //   options={options}
            //   value={options?.find((option) => option.value === value) ?? ""}
            //   placeholder="Choose..."
            //   onChange={(newSelectedOption: SelectOption) => {
            //     onChange(newSelectedOption?.value)
            //   }}
            //   onBlur={onBlur}
            // />
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>Plan:</FormLabel>

        <Controller
          name={`requirements.${index}.data.params.1.value`}
          control={control}
          defaultValue={field.data?.id ?? ""}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              value={value ?? ""}
              placeholder="Optional"
              onChange={(newChange) => {
                onChange(newChange)
                setValue(`requirements.${index}.data.params.1.trait_type`, "planId")
              }}
              onBlur={onBlur}
            />
            // <StyledSelect
            //   ref={ref}
            //   isClearable
            //   options={options}
            //   value={options?.find((option) => option.value === value) ?? ""}
            //   placeholder="Choose..."
            //   onChange={(newSelectedOption: SelectOption) => {
            //     onChange(newSelectedOption?.value)
            //   }}
            //   onBlur={onBlur}
            // />
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default CaskFormCard
