import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
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

        <InputGroup>
          <Controller
            name={`requirements.${index}.data.id` as const}
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
            errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default NooxFormCard
