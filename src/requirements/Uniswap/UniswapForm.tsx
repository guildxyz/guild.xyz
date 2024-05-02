import {
  Box,
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { consts } from "@guildxyz/types"
import Button from "components/common/Button"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Question } from "phosphor-react"
import { useCallback, useState } from "react"
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
import { useSymbolsOfPair } from "./hooks/useSymbolsOfPair"
import { useTokenSymbolsOfPoolVault } from "./hooks/useTokenSymbolsOfPoolVault"

const COUNTED_POSITIONS_OPTIONS = [
  { label: "Full range", value: "FULL_RANGE" },
  { label: "In range", value: "IN_RANGE" },
  { label: "Any range", value: "ALL" },
]

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

  const [shouldShowUrlInput, setShouldShowUrlInput] = useState(false)

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

  const setTokensAndFee = ([t0, t1, fee]) => {
    setValue(`${baseFieldPath}.data.token0`, t0, { shouldDirty: true })
    setValue(`${baseFieldPath}.data.token1`, t1, { shouldDirty: true })
    setValue(`${baseFieldPath}.data.defaultFee`, fee, { shouldDirty: true })
  }

  const { error, isLoading } = useTokenSymbolsOfPoolVault(
    Chains[chain],
    lpVaultAddress,
    setTokensAndFee
  )

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

  const { isLoading: isFetchingFromTokenId, error: tokenIdError } = usePairOfTokenId(
    chain,
    tokenId,
    setTokensAndFee
  )

  const token0 = useWatch({ name: `${baseFieldPath}.data.token0` })
  const token1 = useWatch({ name: `${baseFieldPath}.data.token1` })

  const { symbol0, symbol1 } = useSymbolsOfPair(Chains[chain], token0, token1)

  const baseCurrencyOptions = [
    { value: "token0", label: symbol0 ?? "Token 0" },
    { value: "token1", label: symbol1 ?? "Token 1" },
  ]

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

      {isEditMode && !shouldShowUrlInput ? (
        <>
          <TokenPicker
            label={
              <>
                Token 1
                <Button
                  // This Button feels somewhat hachy
                  size={"xs"}
                  variant={"ghost"}
                  position="absolute"
                  right={0}
                  onClick={() => {
                    setShouldShowUrlInput(true)
                    setValue(`${baseFieldPath}.data.token0`, undefined)
                    setValue(`${baseFieldPath}.data.token1`, undefined)
                    setValue(`${baseFieldPath}.data.baseCurrency`, undefined)
                  }}
                >
                  clear
                </Button>
              </>
            }
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

      <Box w="full">
        <Collapse in={!!token0 && !!token1}>
          <FormControl>
            <FormLabel>Base currency</FormLabel>

            <ControlledSelect
              options={baseCurrencyOptions}
              name={`${baseFieldPath}.data.baseCurrency`}
              defaultValue={"token0"}
            />
          </FormControl>
        </Collapse>
      </Box>

      <FormControl>
        <FormLabel display={"flex"} alignItems={"center"} gap={1}>
          Positions to count
          <Tooltip
            label={
              <Text>
                <strong>Full range:</strong> Count only full-range positions
                <br />
                <strong>In range:</strong> Count positions, which have a price-range
                surrounding the current price
                <br />
                <strong>Any range:</strong> Count all the positions with any
                price-range
              </Text>
            }
          >
            <Icon as={Question} boxSize={4} />
          </Tooltip>
        </FormLabel>

        <ControlledSelect
          options={COUNTED_POSITIONS_OPTIONS}
          name={`${baseFieldPath}.data.countedPositions`}
          defaultValue={"FULL_RANGE"}
        />
      </FormControl>

      <MinMaxAmount field={field} baseFieldPath={baseFieldPath} format="FLOAT" />
    </Stack>
  )
}

export default UniswapForm
