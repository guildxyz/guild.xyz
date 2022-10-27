import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useEffect } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { GuildFormType, Requirement, SelectOption } from "types"
import ChainInfo from "../ChainInfo"
import useKycDAOContracts from "./hooks/useKycDAOContracts"

type Props = {
  index: number
  field: Requirement
}

const KycDAOFormCard = ({ index }: Props): JSX.Element => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  useEffect(() => {
    if (!register) return
    register(`requirements.${index}.chain`, {
      value: "POLYGON",
    })
  }, [register])

  const { isLoading, kycDAOContracts } = useKycDAOContracts()

  return (
    <>
      <ChainInfo>Works on Polygon</ChainInfo>

      <FormControl isRequired isInvalid={!!errors?.requirements?.[index]?.address}>
        <FormLabel>Contract:</FormLabel>

        <Controller
          name={`requirements.${index}.address` as const}
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
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default KycDAOFormCard
