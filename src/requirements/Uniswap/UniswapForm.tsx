import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Skeleton,
  Stack,
} from "@chakra-ui/react"
import { consts } from "@guildxyz/types"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import ChainPicker from "requirements/common/ChainPicker"
import MinMaxAmount from "requirements/common/MinMaxAmount"
import TokenPicker from "requirements/common/TokenPicker"
import parseFromObject from "utils/parseFromObject"
import { Chains } from "wagmiConfig/chains"
import { ADDRESS_REGEX, useParseVaultAddress } from "./hooks/useParseVaultAddress"
import { useTokenSymbolsOfPoolVault } from "./hooks/useTokenSymbolsOfPoolVault"

const UniswapForm = ({
  baseFieldPath,
  field,
}: RequirementFormProps): JSX.Element => {
  const {
    formState: { errors, touchedFields },
    setValue,
    clearErrors,
    register,
  } = useFormContext()
  const isEditMode = !!field?.id

  const chain: (typeof consts.UniswapV3PositionsChains)[number] = useWatch({
    name: `${baseFieldPath}.chain`,
  })

  const lpVaultAddress = useParseVaultAddress(baseFieldPath)

  const { error, isLoading, symbol0, symbol1, token0, token1 } =
    useTokenSymbolsOfPoolVault(Chains[chain], lpVaultAddress)

  useEffect(() => {
    if (!token0 || !token1) {
      return
    }
    setValue(`${baseFieldPath}.data.token0`, token0, { shouldDirty: true })
    setValue(`${baseFieldPath}.data.token1`, token1, { shouldDirty: true })
  }, [token0, token1])

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

      {isEditMode ? (
        <>
          <TokenPicker
            label={"Token 1"}
            chain={chain}
            fieldName={`${baseFieldPath}.data.token0`}
            rules={{ required: "This field is required" }}
          />

          <TokenPicker
            label={"Token 2"}
            chain={chain}
            fieldName={`${baseFieldPath}.data.token1`}
            rules={{ required: "This field is required" }}
          />
        </>
      ) : (
        <FormControl
          isRequired
          isInvalid={
            !!parseFromObject(errors, baseFieldPath)?.data?.lpVault || !!error
          }
        >
          <FormLabel>LP Vault address or URL</FormLabel>
          <Input
            {...register(`${baseFieldPath}.data.lpVault`, {
              required: true,
              validate: (value) =>
                ADDRESS_REGEX.test(value) ||
                "Field has to contain a valid EVM address",
            })}
          />
          {(isLoading || (symbol0 && symbol1)) && (
            <FormHelperText>
              <Skeleton isLoaded={!!symbol0 && !!symbol1} display="inline">
                Pair: {symbol0 ?? "___"}/{symbol1 ?? "___"}
              </Skeleton>
            </FormHelperText>
          )}
          <FormErrorMessage>
            {parseFromObject(errors, baseFieldPath)?.data?.lpVault?.message ??
              "Invalid LP Vault address. Failed to get token pair"}
          </FormErrorMessage>
        </FormControl>
      )}

      <MinMaxAmount field={field} baseFieldPath={baseFieldPath} format="FLOAT" />
    </Stack>
  )
}

export default UniswapForm
