import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { Chains } from "connectors"
import useTokenData from "hooks/useTokenData"
import useTokens from "hooks/useTokens"
import { useEffect } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { MonetizePoapForm, SelectOption } from "types"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.value.toLowerCase() === input?.toLowerCase()

const TokenPicker = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<MonetizePoapForm>()

  const { tokens, isLoading: isTokensLoading } = useTokens(Chains[chainId])

  const mappedTokens = tokens?.map((t) => ({
    img: t.logoURI,
    label: t.name,
    value: t.address,
  }))

  useEffect(() => {
    if (!chainId) return
    setValue("token", "0x0000000000000000000000000000000000000000")
  }, [chainId])

  const token = useWatch({ control, name: "token" })
  const {
    data: { name: tokenName, symbol: tokenSymbol },
    isValidating: isTokenSymbolValidating,
  } = useTokenData(Chains[chainId], token)

  const tokenDataFetched =
    typeof tokenName === "string" &&
    tokenName !== "-" &&
    typeof tokenSymbol === "string" &&
    tokenSymbol !== "-"

  const tokenImage = mappedTokens?.find(
    (t) => t.value?.toLowerCase() === token?.toLowerCase()
  )?.img

  return (
    <FormControl
      isRequired
      isInvalid={
        isTokenSymbolValidating
          ? errors?.token?.type !== "validate" && !!errors?.token
          : !tokenDataFetched && !!errors?.token
      }
    >
      <FormLabel>Currency</FormLabel>
      <InputGroup>
        {token &&
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
          name="token"
          control={control}
          defaultValue="0x0000000000000000000000000000000000000000"
          rules={{
            required: "This field is required.",
            pattern: {
              value: ADDRESS_REGEX,
              message:
                "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
            },
            validate: () =>
              // Using `getValues` instead of `useWatch` here, so the validation is triggered when the input value changes
              !getValues("token") ||
              isTokenSymbolValidating ||
              tokenDataFetched ||
              "Failed to fetch token data",
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              isLoading={isTokensLoading}
              options={mappedTokens}
              filterOption={customFilterOption}
              placeholder="Search or paste address"
              value={
                mappedTokens?.find((t) => t.value === value) ||
                (value
                  ? {
                      value,
                      label: tokenName && tokenName !== "-" ? tokenName : token,
                    }
                  : null)
              }
              defaultValue={mappedTokens?.[0]?.value}
              onChange={(selectedOption: SelectOption) => {
                onChange(selectedOption?.value)
              }}
              onInputChange={(text, _) => {
                if (!ADDRESS_REGEX.test(text)) return
                onChange(text)
              }}
              onBlur={onBlur}
            />
          )}
        />
      </InputGroup>

      <FormErrorMessage>
        {isTokenSymbolValidating
          ? errors?.token?.type !== "validate" && errors?.token?.message
          : !tokenDataFetched && errors?.token?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default TokenPicker
