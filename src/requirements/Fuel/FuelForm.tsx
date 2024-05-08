import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import FuelBalance from "./components/FuelBalance"
import FuelTransactions from "./components/FuelTransactions"

const fuelRequirementTypes = [
  {
    label: "Token balance",
    value: "FUEL_BALANCE",
    FuelRequirement: FuelBalance,
  },
  {
    label: "Wallet activity",
    value: "FUEL_TRANSACTIONS",
    FuelRequirement: FuelTransactions,
  },
]

const FuelForm = ({ baseFieldPath, field }: RequirementFormProps) => {
  const {
    setValue,
    formState: { errors },
    clearErrors,
  } = useFormContext()
  const type = useWatch({ name: `${baseFieldPath}.type` })

  const selected = fuelRequirementTypes.find((reqType) => reqType.value === type)

  const isEditMode = !!field?.id

  const resetFields = () => {
    setValue(`${baseFieldPath}.address`, undefined)
    setValue(`${baseFieldPath}.data.minAmount`, undefined)
    setValue(`${baseFieldPath}.data.maxAmount`, undefined)
    clearErrors([
      `${baseFieldPath}.address`,
      `${baseFieldPath}.data.minAmount`,
      `${baseFieldPath}.data.maxAmount`,
    ])
  }

  useController({
    name: `${baseFieldPath}.chain`,
    defaultValue: "ETHEREUM",
  })

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.type}>
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={fuelRequirementTypes}
          beforeOnChange={resetFields}
          isDisabled={isEditMode}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.FuelRequirement && (
        <>
          <Divider />
          <selected.FuelRequirement baseFieldPath={baseFieldPath} field={field} />
        </>
      )}
    </Stack>
  )
}

export default FuelForm
