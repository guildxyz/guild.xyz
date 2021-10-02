import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Select from "components/common/ChakraReactSelect/ChakraReactSelect"
import ColorCard from "components/common/ColorCard"
import { Chains } from "connectors"
import useTokenData from "hooks/useTokenData"
import useTokensList from "hooks/useTokensList"
import { useEffect, useMemo, useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
import Symbol from "../Symbol"

type Props = {
  index: number
  onRemove?: () => void
}

const TokenFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const tokensList = useTokensList()
  const {
    trigger,
    register,
    setValue,
    getValues,
    formState: { errors, touchedFields },
  } = useFormContext()

  const { chainId } = useWeb3React()

  const type = getValues(`requirements.${index}.type`)

  const inputTimeout = useRef(null)
  const [searchInput, setSearchInput] = useState("")

  const searchResults = useMemo(() => {
    if (searchInput.length < 3) return []

    const searchText = searchInput.toLowerCase()
    let foundTokens = []

    if (searchText.startsWith("0x") && /^0x[A-F0-9]{40}$/i.test(searchText)) {
      setValue(`requirements.${index}.address`, searchText)
      return []
    } else {
      foundTokens =
        tokensList?.filter(
          (token) =>
            token.name.toLowerCase().startsWith(searchText) ||
            token.symbol.toLowerCase().startsWith(searchText)
        ) || []
    }

    return foundTokens
  }, [searchInput, tokensList])

  const searchHandler = (text: string) => {
    window.clearTimeout(inputTimeout.current)
    inputTimeout.current = setTimeout(() => setSearchInput(text), 300)
  }

  // TODO
  const searchResultClickHandler = (selectedOption) => {
    if (selectedOption.value === "ETHER") {
      // Modify the type to ETHER
      setValue(`requirements.${index}.type`, "ETHER")
      setValue(`requirements.${index}.address`, "ETHER")
      return
    }
    setValue(`requirements.${index}.address`, selectedOption.value)
  }

  // Fetch token name from chain
  const tokenAddress = useWatch({ name: `requirements.${index}.address` })

  const {
    data: [tokenName, tokenSymbol],
    isValidating: isTokenSymbolValidating,
  } = useTokenData(tokenAddress)

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

  useEffect(() => {
    setValue("chainName", Chains[chainId])
  }, [chainId, setValue, tokenAddress])

  useEffect(() => {
    if (touchedFields.requirements && touchedFields.requirements[index]?.address)
      trigger(`requirements.${index}.address`)
  }, [isTokenSymbolValidating, tokenDataFetched, wrongChain, trigger, touchedFields])

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

            <Select
              menuIsOpen={searchResults?.length}
              onChange={searchResultClickHandler}
              onInputChange={(text) => searchHandler(text)}
              options={searchResults.map((option) => ({
                img: option.logoURI, // This will be displayed as an Img tag in the list
                label: option.name, // This will be displayed as the option text in the list
                value: option.address, // This will be passed to the hidden input
              }))}
              shouldShowArrow={false}
              filterOption={(data) => data}
              placeholder={tokenAddress || "Search token / paste address"}
              controlShouldRenderValue={false}
              onBlur={() => trigger(`requirements.${index}.address`)}
            />
          </HStack>
          <Input
            type="hidden"
            {...register(`requirements.${index}.address`, {
              required: "This field is required.",
              pattern: tokenAddress?.startsWith("0x") && {
                value: /^0x[A-F0-9]{40}$/i,
                message:
                  "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
              },
              validate: () =>
                isTokenSymbolValidating ||
                !wrongChain ||
                tokenDataFetched ||
                "Failed to fetch symbol.",
            })}
          />

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
