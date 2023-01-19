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
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { Chains } from "connectors"
import useTokenData from "hooks/useTokenData"
import useTokens from "hooks/useTokens"
import { useEffect, useMemo } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { MonetizePoapForm } from "types"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.value.toLowerCase() === input?.toLowerCase()

const TokenPicker = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<MonetizePoapForm>()

  const {
    field: { onChange: tokenFieldOnChange, value: tokenFieldValue },
  } = useController({
    name: "token",
  })

  const { tokens, isLoading: isTokensLoading } = useTokens(Chains[chainId])

  const mappedTokens = useMemo(
    () =>
      tokens?.map((token) => ({
        img: token.logoURI,
        label: token.name,
        value: token.address,
      })),
    [tokens]
  )

  useEffect(() => {
    if (!chainId) return
    setValue("token", "0x0000000000000000000000000000000000000000")
  }, [chainId])

  const token = useWatch({ control, name: "token" })
  const {
    data: { name: tokenName, symbol: tokenSymbol },
    isValidating: isTokenSymbolValidating,
    error,
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

        <ControlledSelect
          name="token"
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
          isLoading={isTokensLoading}
          options={mappedTokens}
          filterOption={customFilterOption}
          placeholder="Search or paste address"
          defaultValue={mappedTokens?.[0]?.value}
          fallbackValue={{
            value: tokenFieldValue,
            label: tokenName && tokenName !== "-" ? tokenName : token,
          }}
          onInputChange={(text, _) => {
            if (!ADDRESS_REGEX.test(text)) return
            tokenFieldOnChange(text)
          }}
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
