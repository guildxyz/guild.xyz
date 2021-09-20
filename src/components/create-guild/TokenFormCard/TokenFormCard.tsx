import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Img,
  Input,
  InputGroup,
  InputLeftAddon,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
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
    const foundTokens =
      tokensList?.filter((token) =>
        searchText.startsWith("0x")
          ? token.address === searchText
          : token.name.toLowerCase().startsWith(searchText) ||
            token.symbol.toLowerCase().startsWith(searchText)
      ) || []

    return foundTokens
  }, [searchInput, tokensList])

  const searchHandler = (text: string) => {
    window.clearTimeout(inputTimeout.current)
    inputTimeout.current = setTimeout(() => setSearchInput(text), 300)
  }

  const searchResultClickHandler = (resultIndex: number) => {
    setValue(`requirements.${index}.address`, searchResults[resultIndex].address)
    searchHandler("")
    trigger(`requirements.${index}.address`)
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

  useEffect(() => {
    if (!tokenAddress?.startsWith("0x")) searchHandler(tokenAddress)
  }, [tokenAddress])

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
          <InputGroup>
            {((tokenDataFetched && tokenSymbol !== undefined) ||
              isTokenSymbolValidating) && (
              <InputLeftAddon fontSize={{ base: "xs", sm: "md" }}>
                {tokenSymbol === undefined && isTokenSymbolValidating ? (
                  <HStack px={4} alignContent="center">
                    <Spinner size="sm" color="blackAlpha.400" />
                  </HStack>
                ) : (
                  tokenSymbol
                )}
              </InputLeftAddon>
            )}
            <Input
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
              autoComplete="off"
              placeholder="Token address"
            />
          </InputGroup>
          <FormHelperText>Type at least 3 characters.</FormHelperText>
          {searchResults.length > 0 && (
            <Card
              position="absolute"
              left={0}
              top="full"
              shadow="xl"
              width="full"
              maxHeight={40}
              bgColor="gray.800"
              overflowY="auto"
              zIndex="dropdown"
            >
              <VStack spacing={1} py={2} alignItems="start">
                {searchResults.map((result, i) => (
                  <HStack
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    px={4}
                    py={1}
                    width="full"
                    transition="0.2s ease"
                    cursor="pointer"
                    _hover={{ bgColor: "gray.700" }}
                    onClick={() => searchResultClickHandler(i)}
                  >
                    <Img boxSize={6} rounded="full" src={result.logoURI} />
                    <Text fontWeight="semibold" as="span">
                      {result.name}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Card>
          )}
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
