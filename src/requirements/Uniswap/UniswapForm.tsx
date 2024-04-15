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
import { useCallback } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import ChainPicker from "requirements/common/ChainPicker"
import MinMaxAmount from "requirements/common/MinMaxAmount"
import TokenPicker from "requirements/common/TokenPicker"
import parseFromObject from "utils/parseFromObject"
import { CHAIN_CONFIG, Chains } from "wagmiConfig/chains"
import { usePairOfTokenId } from "./hooks/usePairOfTokenId"
import { UNISWAP_POOL_URL, useParsePoolTokenId } from "./hooks/useParsePoolTokenId"
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

  const onChainFromParam = useCallback(
    (chainFromParam) => {
      setValue(`${baseFieldPath}.chain`, chainFromParam, { shouldDirty: true })
    },
    [baseFieldPath, setValue]
  )

  const lpVaultAddress = useParseVaultAddress(baseFieldPath)
  const tokenId = useParsePoolTokenId(baseFieldPath, onChainFromParam)

  const {
    error,
    isLoading,
    symbol0: symbol0FromAddress,
    symbol1: symbol1FromAddress,
  } = useTokenSymbolsOfPoolVault(Chains[chain], lpVaultAddress, ([t0, t1]) => {
    setValue(`${baseFieldPath}.data.token0`, t0, { shouldDirty: true })
    setValue(`${baseFieldPath}.data.token1`, t1, { shouldDirty: true })
  })

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

  const {
    isLoading: isFetchingFromTokenId,
    symbol0: symbol0FromTokenId,
    symbol1: symbol1FromTokenId,
    error: tokenIdError,
  } = usePairOfTokenId(chain, tokenId, ([t0, t1]) => {
    setValue(`${baseFieldPath}.data.token0`, t0, { shouldDirty: true })
    setValue(`${baseFieldPath}.data.token1`, t1, { shouldDirty: true })
  })

  const symbol0 = symbol0FromAddress ?? symbol0FromTokenId
  const symbol1 = symbol1FromAddress ?? symbol1FromTokenId

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
            !!parseFromObject(errors, baseFieldPath)?.data?.lpVault ||
            !!error ||
            !!tokenIdError
          }
        >
          <FormLabel>Pool address or URL</FormLabel>
          <Input
            {...register(`${baseFieldPath}.data.lpVault`, {
              required: "This field is required",
              validate: (value) =>
                ADDRESS_REGEX.test(value) ||
                UNISWAP_POOL_URL.test(value) ||
                "Field must be a uniswap pool url, or has to contain a valid EVM address",
            })}
          />
          {(isLoading || (symbol0 && symbol1) || isFetchingFromTokenId) && (
            <FormHelperText>
              <Skeleton isLoaded={!!symbol0 && !!symbol1} display="inline">
                <strong>
                  {symbol0 ?? "___"}/{symbol1 ?? "___"}
                </strong>{" "}
                pair detected on <strong>{CHAIN_CONFIG[chain]?.name}</strong>. If
                this is not correct, ensure the correct chain is selected
              </Skeleton>
            </FormHelperText>
          )}
          <FormErrorMessage>
            {parseFromObject(errors, baseFieldPath)?.data?.lpVault?.message ??
              "Failed to identify pool. Make sure the correct chain is selected"}
          </FormErrorMessage>
        </FormControl>
      )}

      <MinMaxAmount field={field} baseFieldPath={baseFieldPath} format="FLOAT" />
    </Stack>
  )
}

export default UniswapForm
