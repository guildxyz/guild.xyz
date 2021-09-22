import {
  Box,
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Spinner,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Select from "components/common/ChakraReactSelect/ChakraReactSelect"
import ColorCard from "components/common/ColorCard"
import { Chains } from "connectors"
import useTokenData from "hooks/useTokenData"
import { useEffect, useMemo, useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
import useTokensList from "./hooks/useTokensList"

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

    if (foundTokens?.length > 0) {
      setValue(`requirements.${index}.address`, "")
    }

    return foundTokens
  }, [searchInput, tokensList])

  const searchHandler = (text: string) => {
    window.clearTimeout(inputTimeout.current)
    inputTimeout.current = setTimeout(() => setSearchInput(text), 300)
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
          onClick={onRemove}
        />
      )}
      <VStack spacing={4} alignItems="start">
        <FormControl
          position="relative"
          isRequired
          isInvalid={errors?.requirements?.[index]?.address}
        >
          <FormLabel>Search for an ERC-20 token:</FormLabel>
          <HStack maxW="full">
            {((tokenDataFetched && tokenSymbol !== undefined) ||
              isTokenSymbolValidating) && (
              <Box
                bgColor="gray.800"
                h={10}
                lineHeight={10}
                px={2}
                mr={1}
                borderRadius={6}
                fontSize={{ base: "xs", sm: "md" }}
                fontWeight="bold"
              >
                {tokenSymbol === undefined && isTokenSymbolValidating ? (
                  <HStack px={4} h={10} alignContent="center">
                    <Spinner size="sm" color="whiteAlpha.400" />
                  </HStack>
                ) : (
                  tokenSymbol
                )}
              </Box>
            )}

            <Select
              menuIsOpen={searchResults?.length}
              onChange={(selectedOption) => {
                setValue(`requirements.${index}.address`, selectedOption.value)
              }}
              onInputChange={(text) => searchHandler(text)}
              options={searchResults.map((option) => ({
                img: option.logoURI, // This will be displayed as an Img tag in the list
                label: option.name, // This will be displayed as the option text in the list
                value: option.address, // This will be passed to the hidden input
              }))}
              shouldShowArrow={false}
              filterOption={(data) => data}
              placeholder={tokenAddress || "Select..."}
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
          <Input
            type="number"
            {...register(`requirements.${index}.value`, {
              required: "This field is required.",
              min: {
                value: 0,
                message: "Amount must be positive",
              },
            })}
          />
          <FormErrorMessage>
            {errors?.requirements?.[index]?.value?.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
    </ColorCard>
  )
}

export default TokenFormCard
