import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import { CreatableSelect } from "components/common/ChakraReactSelect"
import useTokenData from "hooks/useTokenData"
import useTokens from "hooks/useTokens"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { createFilter } from "react-select"
import { RequirementFormField } from "temporaryData/types"
import ChainPicker from "./ChainPicker"
import FormCard from "./FormCard"
import Symbol from "./Symbol"

type Props = {
  index: number
  field: RequirementFormField
  onRemove: () => void
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const TokenFormCard = ({ index, field, onRemove }: Props): JSX.Element => {
  const {
    control,
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext()

  const chain = useWatch({ name: `requirements.${index}.chain` })
  const type = useWatch({ name: `requirements.${index}.type` })
  const address = useWatch({ name: `requirements.${index}.address` })

  const { isLoading, tokens } = useTokens(chain)
  const mappedTokens = useMemo(
    () =>
      tokens?.map((token) => ({
        img: token.logoURI,
        label: token.name,
        value: token.address,
      })),
    [tokens]
  )

  // Reset form on chain change
  useEffect(() => {
    if (!touchedFields?.requirements?.[index]?.address) return
    setValue(`requirements.${index}.address`, null)
    setValue(`requirements.${index}.value`, 0)
  }, [chain])

  // Change type to "COIN" when address changes to "COIN"
  useEffect(() => {
    if (address !== "0x0000000000000000000000000000000000000000") return
    setValue(`requirements.${index}.type`, "COIN")
  }, [address])

  // Storing the user input value in local state, so we can show the dropdown only of the input's length is > 0
  const [addressInput, setAddressInput] = useState("")

  // Fetching token name and symbol
  const {
    data: { name: tokenName, symbol: tokenSymbol },
    isValidating: isTokenSymbolValidating,
  } = useTokenData(chain, address)

  // Saving this in a useMemo, because we're using it for form validation
  const tokenDataFetched = useMemo(
    () =>
      typeof tokenName === "string" &&
      tokenName !== "-" &&
      typeof tokenSymbol === "string" &&
      tokenSymbol !== "-",
    [tokenName, tokenSymbol]
  )

  return (
    <FormCard type={field.type} onRemove={onRemove}>
      <ChainPicker
        controlName={`requirements.${index}.chain` as const}
        defaultChain={field.chain}
      />

      <FormControl isRequired isInvalid={errors?.requirements?.[index]?.address}>
        <FormLabel>Token:</FormLabel>

        <InputGroup>
          {address && (
            <Symbol
              symbol={tokenSymbol}
              isSymbolValidating={isTokenSymbolValidating}
              isInvalid={type !== "COIN" && errors?.requirements?.[index]?.address}
            />
          )}
          <Controller
            name={`requirements.${index}.address` as const}
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
                !address ||
                isTokenSymbolValidating ||
                tokenDataFetched ||
                "Failed to fetch token data",
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <CreatableSelect
                ref={ref}
                isClearable
                isLoading={isLoading}
                options={mappedTokens}
                filterOptions={createFilter({
                  matchFrom: "start",
                })}
                placeholder="Search or paste address"
                value={
                  mappedTokens?.find((token) => token.value === value) ||
                  (value
                    ? {
                        value,
                        label: tokenName,
                      }
                    : null)
                }
                defaultValue={mappedTokens?.find(
                  (token) => token.value === field.address
                )}
                onChange={(selectedOption) => onChange(selectedOption?.value)}
                onCreateOption={(createdOption) => onChange(createdOption)}
                onBlur={onBlur}
                onInputChange={(text, _) => setAddressInput(text)}
                menuIsOpen={
                  mappedTokens?.length > 80 ? addressInput?.length > 2 : undefined
                }
                // Hiding the dropdown indicator
                components={
                  mappedTokens?.length > 80
                    ? {
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }
                    : undefined
                }
              />
            )}
          />
        </InputGroup>

        {mappedTokens?.length > 80 && (
          <FormHelperText>Type at least 3 characters.</FormHelperText>
        )}
        <FormErrorMessage>
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors?.requirements?.[index]?.value}>
        <FormLabel>Minimum amount to hold:</FormLabel>

        <Controller
          name={`requirements.${index}.value` as const}
          control={control}
          defaultValue={field.value}
          rules={{
            required: "This field is required.",
            min: {
              value: 0,
              message: "Amount must be positive",
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumberInput
              ref={ref}
              value={value}
              defaultValue={field.value}
              onChange={(newValue) => onChange(newValue)}
              onBlur={onBlur}
              min={0}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.value?.message}
        </FormErrorMessage>
      </FormControl>
    </FormCard>
  )
}

export default TokenFormCard
