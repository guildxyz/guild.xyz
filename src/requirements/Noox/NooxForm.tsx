import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import useSWRImmutable from "swr/immutable"
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
    formState: { errors },
  } = useFormContext()

  const id = useWatch({ name: `${baseFieldPath}.data.id` })

  const { data, error, isValidating } = useSWRImmutable<NooxBadge[]>("/api/noox")

  const options = data?.map((badge) => ({
    label: badge.name,
    value: badge.id,
    img: badge.imageThumbnail,
    // details: noox.descriptionEligibility.match(/[0-9]+. times/),
  }))

  const selectedOption = options?.find((option) => option.value === id)

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isRequired
        isInvalid={error || parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>Badge:</FormLabel>

        <InputGroup>
          {selectedOption && (
            <InputLeftElement>
              <OptionImage img={selectedOption.img} alt={"Noox badge image"} />
            </InputLeftElement>
          )}

          <ControlledSelect
            name={`${baseFieldPath}.data.id`}
            rules={{ required: "This field is required." }}
            isClearable
            isLoading={isValidating}
            options={options}
            placeholder="Choose Noox badge"
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
