import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import useAdapters from "../hooks/useAdapters"
import MinScoreField from "./MinScoreField"

const AdapterScore = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()
  const {
    field: { ref, name, value, onChange, onBlur },
  } = useController({
    name: `${baseFieldPath}.data.adapter`,
    rules: {
      required: "It is required to pick an adapter",
    },
  })

  const { adapters, isAdatpersLoading } = useAdapters()
  const mappedAdapters: SelectOption[] =
    adapters?.map((adapter) => ({
      label: adapter,
      value: adapter,
    })) ?? []

  return (
    <>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.adapter}
      >
        <FormLabel>Adapter</FormLabel>
        <StyledSelect
          ref={ref}
          name={name}
          isClearable
          isLoading={isAdatpersLoading}
          options={mappedAdapters}
          value={mappedAdapters.find((a) => a.value === value) ?? ""}
          onChange={(newValue: SelectOption) => onChange(newValue?.value)}
          onBlur={onBlur}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.adapter?.message}
        </FormErrorMessage>
      </FormControl>

      <MinScoreField baseFieldPath={baseFieldPath} />
    </>
  )
}

export default AdapterScore
