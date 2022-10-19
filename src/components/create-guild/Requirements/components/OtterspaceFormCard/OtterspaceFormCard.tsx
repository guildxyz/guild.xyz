import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Controller, useFormContext } from "react-hook-form"
import { Requirement, SelectOption } from "types"
import useOtterspaceBadges from "./hooks/useOtterspaceBadges"

type Props = {
  index: number
  field: Requirement
}

const OtterspaceFormCard = ({ index }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const { data } = useOtterspaceBadges()

  return (
    <>
      <FormControl isRequired>
        <FormLabel>Badge:</FormLabel>

        <Controller
          name={`requirements.${index}.data.id` as const}
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              options={data}
              value={data?.find((option) => option.value === value) ?? ""}
              placeholder="Choose badge"
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

export default OtterspaceFormCard
