import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
} from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect"
import ColorCard from "components/common/ColorCard"
import useTokenData from "hooks/useTokenData"
import useTokens from "hooks/useTokens"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
import Symbol from "./Symbol"

type Props = {
  index: number
  onRemove?: () => void
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const TokenFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const { isLoading, tokens } = useTokens()
  const {
    trigger,
    register,
    setValue,
    getValues,
    formState: { errors },
    control,
  } = useFormContext()

  const type = getValues(`requirements.${index}.type`)

  // So we can show the dropdown only of the input's length is > 0
  const [addressInput, setAddressInput] = useState("")

  // Watch the address input, and switch type to ETHER if needed
  const address = useWatch({ name: `requirements.${index}.address` })
  useEffect(() => {
    if (address === "ETHER") setValue(`requirements.${index}.type`, "ETHER")
  }, [address])

  const {
    data: [tokenName, tokenSymbol],
    isValidating: isTokenSymbolValidating,
  } = useTokenData(address)

  const tokenDataFetched = useMemo(
    () =>
      typeof tokenName === "string" &&
      tokenName.length > 0 &&
      typeof tokenSymbol === "string" &&
      tokenSymbol.length > 0,
    [tokenName, tokenSymbol]
  )

  const wrongChain = useMemo(
    () => tokenName === null && tokenSymbol === null,
    [tokenName, tokenSymbol]
  )

  return (
    <ColorCard color={RequirementTypeColors[type]}>
      {typeof onRemove === "function" && (
        <CloseButton
          position="absolute"
          top={2}
          right={2}
          width={8}
          height={8}
          rounded="full"
          aria-label="Remove requirement"
          zIndex="1"
          onClick={onRemove}
        />
      )}
      <VStack spacing={4} alignItems="start">
        <FormControl
          position="relative"
          isRequired
          isInvalid={type !== "ETHER" && errors?.requirements?.[index]?.address}
        >
          <FormLabel>Search for an ERC-20 token:</FormLabel>
          <HStack maxW="full">
            {((tokenDataFetched && tokenSymbol !== undefined) ||
              isTokenSymbolValidating) && (
              <Symbol
                symbol={tokenSymbol}
                isSymbolValidating={isTokenSymbolValidating}
              />
            )}

            <Controller
              control={control}
              name={`requirements.${index}.address`}
              rules={{
                required: "This field is required.",
                pattern: {
                  value: ADDRESS_REGEX,
                  message:
                    "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
                },
                validate: () =>
                  isTokenSymbolValidating ||
                  !wrongChain ||
                  tokenDataFetched ||
                  "Failed to fetch symbol.",
              }}
              render={({ field: { onChange, ref } }) => (
                <Select
                  isCreatable
                  formatCreateLabel={(_) => `Add custom token`}
                  inputRef={ref}
                  menuIsOpen={addressInput?.length > 2}
                  options={tokens?.map((token) => ({
                    img: token.logoURI, // This will be displayed as an Img tag in the list
                    label: token.name, // This will be displayed as the option text in the list
                    value: token.address, // This is the actual value of this select
                    symbol: token.symbol, // Users can search by symbol too, so we're including it here
                  }))}
                  isLoading={isLoading}
                  onInputChange={(text, _) => setAddressInput(text)}
                  onChange={(newValue) => onChange(newValue.value)}
                  onCreateOption={(createdOption) =>
                    setValue(`requirements.${index}.address`, createdOption)
                  }
                  shouldShowArrow={false}
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
                  placeholder={address || "Search token / paste address"}
                  controlShouldRenderValue={false}
                  onBlur={() => trigger(`requirements.${index}.address`)}
                />
              )}
            />
          </HStack>

          <FormErrorMessage>
            {errors?.requirements?.[index]?.address?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors?.requirements?.[index]?.value}>
          <FormLabel>Minimum amount to hold:</FormLabel>
          <NumberInput defaultValue={0} min={0}>
            <NumberInputField
              {...register(`requirements.${index}.value`, {
                required: "This field is required.",
                min: {
                  value: 0,
                  message: "Amount must be positive",
                },
                valueAsNumber: true,
              })}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>
            {errors?.requirements?.[index]?.value?.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
    </ColorCard>
  )
}

export default TokenFormCard
