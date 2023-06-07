import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledCombobox } from "components/zag/Combobox"
import { useFormContext } from "react-hook-form"
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

        <ControlledCombobox
          name={`${baseFieldPath}.data.id`}
          rules={{ required: "This field is required." }}
          isClearable
          isLoading={isValidating}
          options={options}
          placeholder="Choose Noox badge"
        />

        <FormErrorMessage>
          {(error && "Couldn't fetch Noox badges") ||
            parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default NooxForm
