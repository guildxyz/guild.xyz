import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { Controller, useFormContext } from "react-hook-form"
import useSWRImmutable from "swr/immutable"
import { RequirementFormProps, SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"

export type NooxBadge = {
  id: string
  name: string
  descriptionEligibility: string
  description: string
  image: string
  imageBadge: string
  imageThumbnail: string
}

const NooxForm = ({ baseFieldPath }: RequirementFormProps) => {
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
    <Stack spacing={4} alignItems="start">
      <FormControl
        isRequired
        isInvalid={error || parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>Badge:</FormLabel>

        <InputGroup>
          <Controller
            name={`${baseFieldPath}.data.id` as const}
            control={control}
            rules={{ required: "This field is required." }}
            render={({ field: { onChange, onBlur, value, ref } }) => {
              const selectedOption = options?.find(
                (option) => option.value === value
              )

              return (
                <>
                  {selectedOption && (
                    <InputLeftElement>
                      <OptionImage
                        img={selectedOption.img}
                        alt={"Noox badge image"}
                      />
                    </InputLeftElement>
                  )}
                  <StyledSelect
                    ref={ref}
                    isClearable
                    isLoading={isValidating}
                    options={options}
                    placeholder="Choose Noox badge"
                    value={selectedOption ?? ""}
                    onChange={(newSelectedOption: SelectOption) => {
                      onChange(newSelectedOption?.value)
                    }}
                    onBlur={onBlur}
                  />
                </>
              )
            }}
          />
        </InputGroup>

        <FormErrorMessage>
          {(error && "Couldn't fetch Noox badges") ||
            parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default NooxForm
