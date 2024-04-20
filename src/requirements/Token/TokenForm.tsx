import { Stack } from "@chakra-ui/react"
import useTokenData from "hooks/useTokenData"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import TokenPicker from "requirements/common/TokenPicker"
import parseFromObject from "utils/parseFromObject"
import ChainPicker from "../common/ChainPicker"
import MinMaxAmount from "../common/MinMaxAmount"

const TokenForm = ({ baseFieldPath, field }: RequirementFormProps): JSX.Element => {
  const {
    setValue,
    clearErrors,
    formState: { touchedFields },
  } = useFormContext()

  const chain = useWatch({ name: `${baseFieldPath}.chain` })
  const address = useWatch({ name: `${baseFieldPath}.address` })

  // Reset form on chain change
  const resetForm = () => {
    if (!parseFromObject(touchedFields, baseFieldPath)?.address) return
    setValue(`${baseFieldPath}.address`, null)
    setValue(`${baseFieldPath}.data.minAmount`, 0)
    setValue(`${baseFieldPath}.data.maxAmount`, undefined)
    clearErrors([
      `${baseFieldPath}.address`,
      `${baseFieldPath}.data.minAmount`,
      `${baseFieldPath}.data.maxAmount`,
    ])
  }

  // Change type to "COIN" when address changes to "COIN"
  useEffect(() => {
    setValue(
      `${baseFieldPath}.type`,
      address === "0x0000000000000000000000000000000000000000" ? "COIN" : "ERC20"
    )
  }, [setValue, baseFieldPath, address])

  // Fetching token name and symbol
  const {
    data: { decimals },
  } = useTokenData(chain, address)

  useEffect(() => {
    try {
      setValue(`${baseFieldPath}.balancyDecimals`, decimals)
    } catch {
      setValue(`${baseFieldPath}.balancyDecimals`, undefined)
    }
  }, [setValue, baseFieldPath, decimals])

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain` as const}
        onChange={resetForm}
      />

      <TokenPicker
        chain={chain}
        fieldName={`${baseFieldPath}.address`}
        rules={{ required: "This field is required" }}
      />

      <MinMaxAmount field={field} baseFieldPath={baseFieldPath} format="FLOAT" />
    </Stack>
  )
}

export default TokenForm
