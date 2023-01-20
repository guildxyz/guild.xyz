import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Controller, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import use101Courses from "./hooks/use101Courses"

const HundredNOneForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const { data, isValidating } = use101Courses()

  const options = data?.map((badge) => ({
    value: badge.onChainId.toString(),
    label: badge.courses[0]?.title,
    img: badge.courses[0]?.creator.image,
  }))

  return (
    <>
      <FormControl
        isRequired
        isInvalid={parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>Course:</FormLabel>

        <Controller
          name={`${baseFieldPath}.data.id` as const}
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              options={options}
              value={options?.find((option) => option.value === value) ?? ""}
              placeholder="Choose course"
              onChange={(newSelectedOption: SelectOption) =>
                onChange(newSelectedOption?.value ?? null)
              }
              onBlur={onBlur}
              isLoading={!data && isValidating}
            />
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default HundredNOneForm
