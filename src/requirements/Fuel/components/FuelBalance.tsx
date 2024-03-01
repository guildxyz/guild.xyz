import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import MinMaxAmount from "requirements/common/MinMaxAmount"
import { FUEL_ADDRESS_REGEX } from "types"
import parseFromObject from "utils/parseFromObject"

const FuelBalance = ({ baseFieldPath, field }: RequirementFormProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath)?.address}>
        <FormLabel>Token address</FormLabel>
        <Input
          {...register(`${baseFieldPath}.address`, {
            validate: (value) =>
              FUEL_ADDRESS_REGEX.test(value) || "Invalid Fuel address",
          })}
          placeholder="0x..."
        />
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <MinMaxAmount field={field} baseFieldPath={baseFieldPath} format="FLOAT" />
    </>
  )
}

export default FuelBalance
