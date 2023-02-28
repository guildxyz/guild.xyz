import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"

type Props = RequirementFormProps & {
  isDisabled?: boolean
  optional?: boolean // Using "optional" here because this field is required most of the time anyways
  helperText?: string
}

export type Space = {
  id: string
  name: string
}

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase())

const SpaceSelect = ({
  baseFieldPath,
  optional,
  isDisabled,
  helperText,
}: Props): JSX.Element => {
  const {
    resetField,
    formState: { errors },
  } = useFormContext()

  const { data: spaces, isValidating: isSpacesLoading } = useSWRImmutable<Space[]>(
    "/assets/snapshot/spaces"
  )

  const mappedSpaces = useMemo<SelectOption[]>(
    () =>
      spaces?.map((space) => ({
        label: space.name,
        value: space.id,
        details: space.id,
      })) ?? [],
    [spaces]
  )

  return (
    <FormControl
      isDisabled={isDisabled}
      isRequired={!optional}
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.space}
    >
      <FormLabel>Space</FormLabel>

      <ControlledSelect
        name={`${baseFieldPath}.data.space`}
        rules={{
          required: !optional && "This field is required.",
        }}
        placeholder="Search..."
        isClearable
        isLoading={isSpacesLoading}
        options={mappedSpaces}
        beforeOnChange={() => resetField(`${baseFieldPath}.data.proposal`)}
        filterOption={customFilterOption}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.space?.message}
      </FormErrorMessage>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default SpaceSelect
