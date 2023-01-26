import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Spinner,
  Text,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { Chain } from "connectors"
import useTokenData from "hooks/useTokenData"
import useTokens from "hooks/useTokens"
import { useMemo } from "react"
import { useController, UseControllerProps, useFormContext } from "react-hook-form"

type Props = {
  chain: Chain
  fieldName: string
} & Omit<UseControllerProps, "name">

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.value.toLowerCase() === input?.toLowerCase()

const TokenPicker = ({ chain, fieldName, ...rest }: Props): JSX.Element => {
  const { trigger } = useFormContext()

  const {
    field: { value: address, onChange: addressOnChange },
    fieldState: { error },
  } = useController({
    name: fieldName,
    ...rest,
    rules: {
      pattern: {
        value: ADDRESS_REGEX,
        message:
          "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
      },
      validate: () => !error || "Failed to fetch token data",
      ...rest.rules,
    },
  })

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

  const {
    data: { name: tokenName, symbol: tokenSymbol, decimals: tokenDecimals },
    isValidating: isTokenSymbolValidating,
    error: tokenDataError,
  } = useTokenData(chain, address, () => trigger(fieldName))

  const tokenImage = mappedTokens?.find(
    (token) => token.value?.toLowerCase() === address?.toLowerCase()
  )?.img

  return (
    <FormControl isRequired isInvalid={!!error}>
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
        <ControlledSelect
          name={fieldName}
          rules={{
            required: "This field is required.",
            pattern: {
              value: ADDRESS_REGEX,
              message:
                "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
            },
            validate: () => !tokenDataError || "Failed to fetch token data",
          }}
          isClearable
          isLoading={isLoading}
          options={mappedTokens}
          filterOption={customFilterOption}
          placeholder="Search or paste address"
          onInputChange={(text, _) => {
            if (!ADDRESS_REGEX.test(text)) return
            addressOnChange(text)
          }}
          fallbackValue={
            address && {
              value: address,
              label: tokenName && tokenName !== "-" ? tokenName : address,
              decimals: tokenDecimals,
            }
          }
        />
      </InputGroup>

      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default TokenPicker
