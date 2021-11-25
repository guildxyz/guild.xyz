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
import React, { useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
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
    register,
    setValue,
    getValues,
    formState: { errors },
    trigger,
    clearErrors,
    control,
  } = useFormContext()

  const type = useWatch({ name: `requirements.${index}.type`, control })
  const [defaultChain, setDefaultChain] = useState(
    getValues(`requirements.${index}.chain`)
  )

  // Reset fields when chain changes
  const chain = useWatch({ name: `requirements.${index}.chain`, control })
  useEffect(() => {
    if (!chain || chain === defaultChain) return
    setValue(`requirements.${index}.address`, null)
    setValue(`requirements.${index}.value`, 0)
    clearErrors(`requirements.${index}.address`)
    setDefaultChain(null)
  }, [chain])

  // Set default value if needed (because if type is "COIN", we don't get a token address from the API)
  useEffect(() => {
    if (type === "COIN" && !address)
      setValue(`requirements.${index}.address`, "COIN")
  }, [index, type])

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
  const address = useWatch({ name: `requirements.${index}.address`, control })

  useEffect(() => {
    if (!address) return
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

  const value = useWatch({ name: `requirements.${index}.value`, control })

  // Registering inputs

  useEffect(() => {
    // Registering these inputs this way instead of using a Controller component (or useController), because some fields remained in the fieldsarray even after we removed them, which caused bugs in the application
    register(`requirements.${index}.address` as const, {
      required: "This field is required.",
      pattern: type !== "COIN" && {
        value: ADDRESS_REGEX,
        message:
          "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
      },
      validate: () =>
        isTokenSymbolValidating || tokenDataFetched || "Failed to fetch symbol.",
      shouldUnregister: true,
    })

    register(`requirements.${index}.value` as const, {
      required: "This field is required.",
      min: {
        value: 0,
        message: "Amount must be positive",
      },
      shouldUnregister: true,
    })
  }, [register, isTokenSymbolValidating, tokenDataFetched])

  useEffect(() => {
    if (address && !isTokenSymbolValidating) trigger(`requirements.${index}.address`)
  }, [address, isTokenSymbolValidating, tokenDataFetched])

  return (
    <FormCard type="ERC20" onRemove={onRemove}>
      <ChainPicker controlName={`requirements.${index}.chain` as const} />

      <FormControl
        position="relative"
        isRequired
        isInvalid={type !== "COIN" && errors?.requirements?.[index]?.address}
      >
        <FormLabel>Token:</FormLabel>
        <InputGroup>
          {address && (
            <Symbol
              symbol={tokenSymbol}
              isSymbolValidating={isTokenSymbolValidating}
              isInvalid={type !== "COIN" && errors?.requirements?.[index]?.address}
            />
          )}

          <CreatableSelect
            isClearable
            formatCreateLabel={(_) => `Add custom token`}
            menuIsOpen={
              mappedTokens?.length > 80 ? addressInput?.length > 2 : undefined
            }
            options={mappedTokens}
            isLoading={isLoading}
            onInputChange={(text, _) => setAddressInput(text)}
            defaultValue={null}
            value={
              mappedTokens?.find((token) => token.value === address) ||
              (address
                ? {
                    address,
                    label: tokenName,
                  }
                : null)
            }
            onChange={(newValue) =>
              setValue(`requirements.${index}.address`, newValue?.value)
            }
            onCreateOption={(createdOption) =>
              setValue(`requirements.${index}.address`, createdOption)
            }
            filterOption={(candidate, input) => {
              const lowerCaseInput = input?.toLowerCase()
              return (
                candidate.label?.toLowerCase().startsWith(lowerCaseInput) ||
                candidate.data?.symbol?.toLowerCase().startsWith(lowerCaseInput) ||
                candidate.value.toLowerCase() === lowerCaseInput
              )
            }}
            placeholder="Search or paste address"
            // Hiding the dropdown indicator
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
          />
        </InputGroup>
        <FormHelperText>Type at least 3 characters.</FormHelperText>
        <FormErrorMessage>
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors?.requirements?.[index]?.value}>
        <FormLabel>Minimum amount to hold:</FormLabel>

        <NumberInput
          min={0}
          defaultValue={value || 0}
          onChange={(newValue) => setValue(`requirements.${index}.value`, +newValue)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <FormErrorMessage>
          {errors?.requirements?.[index]?.value?.message}
        </FormErrorMessage>
      </FormControl>
    </FormCard>
  )
}

export default TokenFormCard
