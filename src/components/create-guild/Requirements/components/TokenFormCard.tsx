import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect"
import useTokenData from "hooks/useTokenData"
import useTokens from "hooks/useTokens"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import ChainPicker from "./ChainPicker"
import FormCard from "./FormCard"
import Symbol from "./Symbol"

type Props = {
  index: number
  onRemove?: () => void
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const TokenFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const {
    trigger,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
    control,
  } = useFormContext()

  const type = getValues(`requirements.${index}.type`)
  const [defaultChain, setDefaultChain] = useState(
    getValues(`requirements.${index}.chain`)
  )

  // Set default value if needed
  useEffect(() => {
    if (type === "COIN") setValue(`requirements.${index}.address`, "COIN")
  }, [])

  // Reset fields when chain changes
  const chain = useWatch({ name: `requirements.${index}.chain` })
  useEffect(() => {
    if (chain === defaultChain) return
    setValue(`requirements.${index}.address`, null)
    setValue(`requirements.${index}.value`, 0)
    setDefaultChain(null)
  }, [chain])

  const { isLoading, tokens } = useTokens(chain)
  const mappedTokens = useMemo(
    () =>
      tokens?.map((token) => ({
        img: token.logoURI, // This will be displayed as an Img tag in the list
        label: token.name, // This will be displayed as the option text in the list
        value: token.address, // This is the actual value of this select
        symbol: token.symbol, // Users can search by symbol too, so we're including it here
      })),
    [tokens]
  )

  // So we can show the dropdown only of the input's length is > 0
  const [addressInput, setAddressInput] = useState("")

  // Watch the address input, and switch type to COIN if needed
  const address = useWatch({ name: `requirements.${index}.address` })

  useEffect(() => {
    if (address === "COIN") setValue(`requirements.${index}.type`, "COIN")
    else setValue(`requirements.${index}.type`, "ERC20")
  }, [address])

  const {
    data: { name: tokenName, symbol: tokenSymbol },
    isValidating: isTokenSymbolValidating,
  } = useTokenData(chain, address)

  const tokenDataFetched = useMemo(
    () =>
      typeof tokenName === "string" &&
      tokenName !== "-" &&
      typeof tokenSymbol === "string" &&
      tokenSymbol !== "-",
    [tokenName, tokenSymbol]
  )

  useEffect(() => {
    if (!address) return
    trigger(`requirements.${index}.address`)
  }, [address, isTokenSymbolValidating, tokenDataFetched])

  const SelectWrapperElement = useMemo(
    () => (address ? InputGroup : React.Fragment),
    [address]
  )

  return (
    <FormCard type="ERC20" onRemove={onRemove}>
      <ChainPicker controlName={`requirements.${index}.chain`} />

      <FormControl
        position="relative"
        isRequired
        isInvalid={type !== "COIN" && errors?.requirements?.[index]?.address}
      >
        <FormLabel>Token:</FormLabel>
        <SelectWrapperElement>
          {address && (
            <Symbol
              symbol={tokenSymbol}
              isSymbolValidating={isTokenSymbolValidating}
              isInvalid={type !== "COIN" && errors?.requirements?.[index]?.address}
            />
          )}

          <Controller
            control={control}
            name={`requirements.${index}.address`}
            rules={{
              required: "This field is required.",
              pattern: type !== "COIN" && {
                value: ADDRESS_REGEX,
                message:
                  "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
              },
              validate: () =>
                !address ||
                isTokenSymbolValidating ||
                tokenDataFetched ||
                "Failed to fetch symbol.",
            }}
            render={({ field: { onBlur, onChange, ref, value } }) => (
              <Select
                isCreatable
                isClearable
                formatCreateLabel={(_) => `Add custom token`}
                inputRef={ref}
                menuIsOpen={
                  mappedTokens?.length > 80 ? addressInput?.length > 2 : undefined
                }
                options={mappedTokens}
                isLoading={isLoading}
                onInputChange={(text, _) => setAddressInput(text)}
                value={mappedTokens?.find((token) => token.value === value)}
                onBlur={onBlur}
                onChange={(newValue) => onChange(newValue?.value)}
                onCreateOption={(createdOption) =>
                  setValue(`requirements.${index}.address`, createdOption)
                }
                shouldShowArrow={mappedTokens?.length < 80}
                filterOption={(candidate, input) => {
                  const lowerCaseInput = input?.toLowerCase()
                  return (
                    candidate.label?.toLowerCase().startsWith(lowerCaseInput) ||
                    candidate.data?.symbol
                      ?.toLowerCase()
                      .startsWith(lowerCaseInput) ||
                    candidate.value.toLowerCase() === lowerCaseInput
                  )
                }}
                placeholder={tokenName || "Search token / paste address"}
              />
            )}
          />
        </SelectWrapperElement>

        <FormErrorMessage>
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors?.requirements?.[index]?.value}>
        <FormLabel>Minimum amount to hold:</FormLabel>
        <Controller
          control={control}
          name={`requirements.${index}.value`}
          rules={{
            required: "This field is required.",
            min: {
              value: 0,
              message: "Amount must be positive",
            },
          }}
          render={({ field: { onBlur, onChange, ref, value } }) => (
            <NumberInput
              ref={ref}
              min={0}
              value={value || 0}
              onBlur={onBlur}
              onChange={onChange}
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
