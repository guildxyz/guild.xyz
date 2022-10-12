import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { BigNumber } from "@ethersproject/bignumber"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenData from "hooks/useTokenData"
import useTokens from "hooks/useTokens"
import { useEffect, useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { FormCardProps, SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import ChainPicker from "./ChainPicker"
import MinMaxAmount from "./MinMaxAmount"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.value.toLowerCase() === input?.toLowerCase()

const TokenFormCard = ({ baseFieldPath, field }: FormCardProps): JSX.Element => {
  const {
    control,
    getValues,
    setValue,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext()

  const chain = useWatch({ name: `${baseFieldPath}chain` })
  const address = useWatch({ name: `${baseFieldPath}address` })

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
    setValue(`${baseFieldPath}address`, null)
    setValue(`${baseFieldPath}data.minAmount`, 0)
    setValue(`${baseFieldPath}data.maxAmount`, undefined)
    clearErrors([
      `${baseFieldPath}address`,
      `${baseFieldPath}data.minAmount`,
      `${baseFieldPath}data.maxAmount`,
    ])
  }

  // Change type to "COIN" when address changes to "COIN"
  useEffect(() => {
    // When we check the "Free entry" checkbox, the type changed here to ERC20, and a blank ERC20 card showed up on the list. This line prevents this behaviour.
    if (!chain) return
    setValue(
      `${baseFieldPath}type`,
      address === "0x0000000000000000000000000000000000000000" ? "COIN" : "ERC20"
    )
  }, [address])

  // Fetching token name and symbol
  const {
    data: { name: tokenName, symbol: tokenSymbol, decimals: tokenDecimals },
    isValidating: isTokenSymbolValidating,
  } = useTokenData(chain, address)

  useEffect(() => {
    try {
      setValue(
        `${baseFieldPath}balancyDecimals`,
        BigNumber.from(tokenDecimals).toNumber()
      )
    } catch {
      setValue(`${baseFieldPath}balancyDecimals`, undefined)
    }
  }, [tokenDecimals])

  // Saving this in a useMemo, because we're using it for form validation
  const tokenDataFetched = useMemo(
    () =>
      typeof tokenName === "string" &&
      tokenName !== "-" &&
      typeof tokenSymbol === "string" &&
      tokenSymbol !== "-",
    [tokenName, tokenSymbol]
  )

  const tokenImage = useMemo(
    () =>
      mappedTokens?.find(
        (token) => token.value?.toLowerCase() === address?.toLowerCase()
      )?.img,
    [address]
  )

  return (
    <>
      <ChainPicker
        controlName={`${baseFieldPath}chain` as const}
        defaultChain={field.chain}
        onChange={resetForm}
      />

      <FormControl
        isRequired
        isInvalid={
          isTokenSymbolValidating
            ? parseFromObject(errors, baseFieldPath)?.address?.type !== "validate" &&
              !!parseFromObject(errors, baseFieldPath)?.address
            : !tokenDataFetched && !!parseFromObject(errors, baseFieldPath)?.address
        }
      >
        <FormLabel>Token:</FormLabel>

        <InputGroup>
          {address &&
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
          <Controller
            name={`${baseFieldPath}address` as const}
            control={control}
            defaultValue={field.address}
            rules={{
              required: "This field is required.",
              pattern: {
                value: ADDRESS_REGEX,
                message:
                  "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
              },
              validate: () =>
                // Using `getValues` instead of `useWatch` here, so the validation is triggered when the input value changes
                !getValues(`${baseFieldPath}address`) ||
                isTokenSymbolValidating ||
                tokenDataFetched ||
                "Failed to fetch token data",
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                isLoading={isLoading}
                options={mappedTokens}
                filterOption={customFilterOption}
                placeholder="Search or paste address"
                value={
                  mappedTokens?.find((token) => token.value === value) ||
                  (value
                    ? {
                        value,
                        label: tokenName && tokenName !== "-" ? tokenName : address,
                      }
                    : null)
                }
                defaultValue={mappedTokens?.find(
                  (token) => token.value === field.address
                )}
                onChange={(selectedOption: SelectOption & { decimals: number }) => {
                  onChange(selectedOption?.value)
                }}
                onBlur={onBlur}
                onInputChange={(text, _) => {
                  if (!ADDRESS_REGEX.test(text)) return
                  onChange(text)
                }}
              />
            )}
          />
        </InputGroup>

        <FormErrorMessage>
          {isTokenSymbolValidating
            ? parseFromObject(errors, baseFieldPath)?.address?.type !== "validate" &&
              parseFromObject(errors, baseFieldPath)?.address?.message
            : !tokenDataFetched &&
              parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <MinMaxAmount field={field} baseFieldPath={baseFieldPath} format="FLOAT" />
    </>
  )
}

export default TokenFormCard
