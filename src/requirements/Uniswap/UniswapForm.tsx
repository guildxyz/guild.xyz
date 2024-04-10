import { Stack } from "@chakra-ui/react"
import { consts } from "@guildxyz/types"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import ChainPicker from "requirements/common/ChainPicker"
import MinMaxAmount from "requirements/common/MinMaxAmount"
import TokenPicker from "requirements/common/TokenPicker"
import parseFromObject from "utils/parseFromObject"

const UniswapForm = ({
  baseFieldPath,
  field,
}: RequirementFormProps): JSX.Element => {
  const {
    formState: { errors, touchedFields },
    setValue,
    clearErrors,
  } = useFormContext()

  const chain = useWatch({ name: `${baseFieldPath}.chain` })

  // Reset form on chain change
  const resetForm = () => {
    if (!parseFromObject(touchedFields, baseFieldPath)?.address) return
    setValue(`${baseFieldPath}.data.token0`, undefined)
    setValue(`${baseFieldPath}.data.token1`, undefined)
    setValue(`${baseFieldPath}.data.minAmount`, undefined)
    setValue(`${baseFieldPath}.data.maxAmount`, undefined)
    clearErrors([
      `${baseFieldPath}.data.token0`,
      `${baseFieldPath}.data.token1`,
      `${baseFieldPath}.data.minAmount`,
      `${baseFieldPath}.data.maxAmount`,
    ])
  }

  console.log(consts.UniswapV3PositionsChains)

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain` as const}
        supportedChains={
          consts.UniswapV3PositionsChains as unknown as Array<
            (typeof consts.UniswapV3PositionsChains)[number]
          >
        }
        onChange={resetForm}
      />
      <TokenPicker
        label={"Pair 1"}
        chain={chain}
        fieldName={`${baseFieldPath}.data.token0`}
        rules={{ required: "This field is required" }}
      />

      <TokenPicker
        label={"Pair 2"}
        chain={chain}
        fieldName={`${baseFieldPath}.data.token1`}
        rules={{ required: "This field is required" }}
      />
      <MinMaxAmount field={field} baseFieldPath={baseFieldPath} format="FLOAT" />
    </Stack>
  )
}

export default UniswapForm
