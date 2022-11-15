import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useEffect } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { RequirementFormProps, SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import ChainInfo from "../ChainInfo"
import useKycDAOContracts from "./hooks/useKycDAOContracts"

const KycDAOForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext()

  useEffect(() => {
    if (!register) return
    register(`${baseFieldPath}.chain`, {
      value: "POLYGON",
    })
  }, [register])

  const { isLoading, kycDAOContracts } = useKycDAOContracts()

  return (
    <Stack spacing={4} alignItems="start">
      <ChainInfo>Works on Polygon</ChainInfo>

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.address}
      >
        <FormLabel>Contract:</FormLabel>

        <Controller
          name={`${baseFieldPath}.address` as const}
          control={control}
          rules={{
            required: "This field is required.",
          }}
          render={({ field: { onChange, onBlur, value: selectValue, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              isLoading={isLoading}
              options={kycDAOContracts}
              placeholder="Select one"
              value={kycDAOContracts?.find((p) => p.value === selectValue)}
              onChange={(newValue: SelectOption) => onChange(newValue?.value)}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default KycDAOForm
