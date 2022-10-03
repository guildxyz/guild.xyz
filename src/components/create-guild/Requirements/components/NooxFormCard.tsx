import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Controller, useFormContext } from "react-hook-form"
import useSWRImmutable from "swr/immutable"
import { Requirement, SelectOption } from "types"

type Props = {
  index: number
  field: Requirement
}

export type NooxBadge = {
  id: string
  name: string
  descriptionEligibility: string
  description: string
  image: string
  imageBadge: string
  imageThumbnail: string
}

const NooxFormCard = ({ index, field }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const { data, error, isValidating } = useSWRImmutable<NooxBadge[]>("/api/noox")

  const options = data?.map((badge) => ({
    label: badge.name,
    value: badge.id,
    img: badge.imageThumbnail,
    // details: noox.descriptionEligibility.match(/[0-9]+. times/),
  }))

  return (
    <>
      <FormControl
        isRequired
        isInvalid={error || errors?.requirements?.[index]?.data?.id}
      >
        <FormLabel>Badge:</FormLabel>

        <Controller
          name={`requirements.${index}.data.id` as const}
          control={control}
          defaultValue={field.data?.id ?? ""}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              isLoading={isValidating}
              options={options}
              placeholder="Choose Noox badge"
              value={options?.find((option) => option.value === value) ?? ""}
              onChange={(selectedOption: SelectOption) => {
                onChange(selectedOption?.value)
              }}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {(error && "Couldn't fetch Noox badges") ||
            errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default NooxFormCard
