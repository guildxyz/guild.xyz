import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Spinner,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import CloseButton from "components/common/CloseButton"
import { Chains } from "connectors"
import useTokenData from "hooks/useTokenData"
import { useEffect, useMemo, useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
import Select from "../../common/ChakraReactSelect/ChakraReactSelect"
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

  const { colorMode } = useColorMode()

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
    <Card
      role="group"
      position="relative"
      px={{ base: 5, sm: 7 }}
      pt={10}
      pb={7}
      w="full"
      bg={colorMode === "light" ? "white" : "gray.700"}
      borderWidth={2}
      borderColor={RequirementTypeColors[type]}
      overflow="visible"
      _before={{
        content: `""`,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: "primary.300",
        opacity: 0,
        transition: "opacity 0.2s",
      }}
    >
      {typeof onRemove === "function" && (
        <CloseButton
          position="absolute"
          top={2}
          right={2}
          zIndex="docked"
          aria-label="Remove requirement"
          onClick={onRemove}
        />
      )}
      <VStack spacing={4} alignItems="start">
        <FormControl
          position="relative"
          isRequired
          isInvalid={
            errors.requirements &&
            errors.requirements[index] &&
            errors.requirements[index].address
          }
        >
          <FormLabel>Search for an ERC-20 token:</FormLabel>
          <HStack>
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
              onChange={(selectedOption) => {
                setValue(`requirements.${index}.address`, selectedOption.value)
              }}
              onInputChange={(text) => {
                if (!text.startsWith("0x")) searchHandler(text)
              }}
              options={searchResults.map((option) => ({
                img: option.logoURI, // This will be displayed as an Img tag in the list
                label: option.name, // This will be displayed as the option text in the list
                value: option.address, // This will be passed to the hidden input
              }))}
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
            {errors.requirements && errors.requirements[index]?.address?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={errors.requirements && errors.requirements[index]?.value}
        >
          <FormLabel>Minimum amount to hold:</FormLabel>
          <Input
            type="number"
            {...register(`requirements.${index}.value`, {
              required: "This field is required.",
            })}
          />
        </FormControl>
      </VStack>
    </Card>
  )
}

export default TokenFormCard
