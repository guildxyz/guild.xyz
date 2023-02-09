import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { BigNumber } from "@ethersproject/bignumber"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenData from "hooks/useTokenData"
import useTokens from "hooks/useTokens"
import { useEffect, useMemo } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import ChainPicker from "../common/ChainPicker"
import MinMaxAmount from "../common/MinMaxAmount"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.value.toLowerCase() === input?.toLowerCase()

const TokenForm = ({ baseFieldPath, field }: RequirementFormProps): JSX.Element => {
  const {
    setValue,
    clearErrors,
    trigger,
    formState: { errors, touchedFields },
  } = useFormContext()

  const {
    field: { value: addressFieldValue, onChange: addressFieldOnChange },
  } = useController({ name: `${baseFieldPath}.address` })

  const chain = useWatch({ name: `${baseFieldPath}.chain` })

  const { isLoading, tokens } = useTokens(chain)
  const mappedTokens = useMemo(
    () =>
      tokens?.map((token) => ({
        img: token.logoURI,
        label: token.name,
        value: token.address,
        decimals: token.decimals,
      })),
    [tokens]
  )

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
      addressFieldValue === "0x0000000000000000000000000000000000000000"
        ? "COIN"
        : "ERC20"
    )
  }, [addressFieldValue])

  // Fetching token name and symbol
  const {
    data: { name: tokenName, symbol: tokenSymbol, decimals: tokenDecimals },
    isValidating: isTokenSymbolValidating,
    error,
  } = useTokenData(chain, addressFieldValue, () =>
    trigger(`${baseFieldPath}.address`)
  )

  useEffect(() => {
    try {
      setValue(
        `${baseFieldPath}.balancyDecimals`,
        BigNumber.from(tokenDecimals).toNumber()
      )
    } catch {
      setValue(`${baseFieldPath}.balancyDecimals`, undefined)
    }
  }, [tokenDecimals])

  const tokenImage = mappedTokens?.find(
    (token) => token.value?.toLowerCase() === addressFieldValue?.toLowerCase()
  )?.img

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain` as const}
        onChange={resetForm}
      />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.address}
      >
        <FormLabel>Token:</FormLabel>

        <InputGroup>
          {addressFieldValue &&
            (tokenImage ? (
              <InputLeftElement>
                <OptionImage img={tokenImage} alt={tokenName} />
              </InputLeftElement>
            ) : (
              <InputLeftAddon px={2} maxW={14}>
                {isTokenSymbolValidating ? (
                  <Spinner size="sm" />
                ) : (
                  <Text as="span" fontSize="xs" fontWeight="bold" noOfLines={1}>
                    {tokenSymbol}
                  </Text>
                )}
              </InputLeftAddon>
            ))}
          <ControlledSelect
            name={`${baseFieldPath}.address`}
            rules={{
              required: "This field is required.",
              pattern: {
                value: ADDRESS_REGEX,
                message:
                  "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
              },
              validate: () => !error || "Failed to fetch token data",
            }}
            isClearable
            isLoading={isLoading}
            options={mappedTokens}
            filterOption={customFilterOption}
            placeholder="Search or paste address"
            onInputChange={(text, _) => {
              if (!ADDRESS_REGEX.test(text)) return
              addressFieldOnChange(text)
            }}
            fallbackValue={
              addressFieldValue && {
                value: addressFieldValue,
                label:
                  tokenName && tokenName !== "-" ? tokenName : addressFieldValue,
              }
            }
          />
        </InputGroup>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <MinMaxAmount field={field} baseFieldPath={baseFieldPath} format="FLOAT" />
    </Stack>
  )
}

export default TokenForm
