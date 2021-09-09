import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Spinner,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { useMemo, useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { nfts } from "temporaryData/nfts"
import { HoldTypeColors } from "temporaryData/types"
import shortenHex from "utils/shortenHex"
import useNftCustomAttributeNames from "./hooks/useNftCustomAttributeNames"
import useNftCustomAttributeValues from "./hooks/useNftCustomAttributeValues"

type Props = {
  index: number
  clickHandler?: () => void
}

const NftFormCard = ({ index, clickHandler }: Props): JSX.Element => {
  const {
    trigger,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext()
  const holdType = getValues(`requirements.${index}.holdType`)

  const { colorMode } = useColorMode()

  const inputTimeout = useRef(null)
  const [searchInput, setSearchInput] = useState("")

  const searchResults = useMemo(() => {
    if (!searchInput.length) {
      return []
    }

    const searchText = searchInput.toLowerCase()
    const foundNFTs =
      nfts?.filter((nft) =>
        searchText.startsWith("0x")
          ? nft.address === searchText
          : nft.name.toLowerCase().includes(searchText)
      ) || []

    return foundNFTs
  }, [searchInput])

  const searchHandler = (text: string) => {
    window.clearTimeout(inputTimeout.current)
    inputTimeout.current = setTimeout(() => setSearchInput(text), 300)
  }

  const searchResultClickHandler = (resultIndex: number) => {
    setValue(`requirements.${index}.nft`, searchResults[resultIndex].address)
    searchHandler("")
    trigger(`requirements.${index}.nft`)
  }

  const pickedNftAddress = useWatch({ name: `requirements.${index}.nft` })
  const nftCustomAttributeNames = useNftCustomAttributeNames(pickedNftAddress)
  const pickedAttribute = useWatch({
    name: `requirements.${index}.customAttributeName`,
  })
  const nftCustomAttributeValues = useNftCustomAttributeValues(
    pickedNftAddress,
    pickedAttribute
  )

  return (
    <Card
      role="group"
      position="relative"
      px={{ base: 5, sm: 7 }}
      py="7"
      w="full"
      bg={colorMode === "light" ? "white" : "gray.700"}
      borderWidth={2}
      borderColor={HoldTypeColors[holdType]}
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
      <VStack spacing={4} alignItems="start">
        <FormControl
          position="relative"
          isRequired
          isInvalid={
            holdType &&
            errors.requirements &&
            errors.requirements[index] &&
            errors.requirements[index][holdType.toLowerCase()]
          }
        >
          <FormLabel>Search for an NFT or paste smart contract address:</FormLabel>
          <InputGroup>
            {getValues(`requirements.${index}.nft`) && (
              <InputLeftAddon>
                {nfts.find(
                  (nft) => nft.address === getValues(`requirements.${index}.nft`)
                )?.name || <Spinner />}
              </InputLeftAddon>
            )}
            <Input
              {...register(`requirements.${index}.nft`, {
                required: "This field is required.",
                pattern: {
                  value: /^0x[A-F0-9]{40}$/i,
                  message:
                    "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
                },
              })}
              autoComplete="off"
              onChange={(e) => searchHandler(e.target.value)}
            />
          </InputGroup>
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
                    justifyContent="space-between"
                    transition="0.2s ease"
                    cursor="pointer"
                    _hover={{ bgColor: "gray.700" }}
                    onClick={() => searchResultClickHandler(i)}
                  >
                    <Text fontWeight="semibold" as="span">
                      {result.name}
                    </Text>
                    <Text as="span" colorScheme="gray">
                      {shortenHex(result.address, 3)}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Card>
          )}
          <FormErrorMessage>
            {errors.requirements && errors.requirements[index]?.nft?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isRequired
          isInvalid={
            errors.requirements && errors.requirements[index]?.customAttributeName
          }
        >
          <FormLabel>Custom attribute:</FormLabel>

          <Select
            {...register(`requirements.${index}.customAttributeName`, {
              required: "This field is required.",
            })}
            isDisabled={!nftCustomAttributeNames?.length}
          >
            <option value="" defaultChecked>
              Select one
            </option>
            {nftCustomAttributeNames?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.requirements &&
              errors.requirements[index]?.customAttributeName?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isRequired
          isInvalid={
            errors.requirements && errors.requirements[index]?.customAttributeValue
          }
        >
          <FormLabel>Custom attribute value:</FormLabel>

          <Select
            {...register(`requirements.${index}.customAttributeValue`, {
              required: "This field is required.",
            })}
            isDisabled={!nftCustomAttributeValues?.length}
          >
            <option value="" defaultChecked>
              Select one
            </option>
            {nftCustomAttributeValues?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </Select>

          <FormErrorMessage>
            {errors.requirements &&
              errors.requirements[index]?.customAttributeValue?.message}
          </FormErrorMessage>
        </FormControl>

        <HStack width="full" alignContent="end">
          <Button
            size="sm"
            colorScheme="gray"
            ml="auto"
            onClick={typeof clickHandler === "function" && clickHandler}
          >
            Cancel
          </Button>
        </HStack>
      </VStack>
    </Card>
  )
}

export default NftFormCard
