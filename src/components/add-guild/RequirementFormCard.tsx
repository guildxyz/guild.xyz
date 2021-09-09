import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { useMemo, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import { CoingeckoToken, HoldTypeColors } from "temporaryData/types"

type Props = {
  field: any // ?
  index: number
  tokensList: CoingeckoToken[] // TODO: better typing
  clickHandler?: () => void
}

const RequirementFormCard = ({
  field,
  index,
  tokensList,
  clickHandler,
}: Props): JSX.Element => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext()

  const holdType = getValues(`requirements.${index}.holdType`)

  const { colorMode } = useColorMode()

  const inputTimeout = useRef(null)
  const [searchInput, setSearchInput] = useState<{
    type: "TOKEN" | "NFT" | "POAP"
    text: string
  }>({ type: null, text: "" })

  const searchResults = useMemo(() => {
    if (searchInput.text.length < 1) return []

    if (searchInput.type === "TOKEN") {
      const searchText = searchInput.text.toLowerCase()
      const foundTokens =
        tokensList?.filter((token) =>
          searchText.startsWith("0x")
            ? token.address === searchText
            : token.name.toLowerCase().includes(searchText)
        ) || []

      return foundTokens
    }

    // TODO... (default case)
    return []
  }, [searchInput])

  const searchHandler = (type: "TOKEN" | "NFT" | "POAP", text: string) => {
    window.clearTimeout(inputTimeout.current)
    inputTimeout.current = setTimeout(() => setSearchInput({ type, text }), 300)
  }

  // We can extract this too in a hook later
  let fieldName = ""

  switch (holdType) {
    case "NFT":
      fieldName = `requirements.${index}.nft`
      break
    case "POAP":
      fieldName = `requirements.${index}.poap`
      break
    default:
      fieldName = `requirements.${index}.token`
  }

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
          <FormLabel>
            Search for
            {holdType === "NFT" && " an NFT or paste smart contract address:"}
            {holdType === "POAP" && " a POAP:"}
            {holdType === "TOKEN" && " an ERC-20 token:"}
          </FormLabel>
          <Input
            {...register(fieldName, {
              required: "This field is required.",
            })}
            defaultValue={field.value} // make sure to include defaultValue
            autoComplete="off"
            onChange={(e) => searchHandler(holdType, e.target.value)}
          />
          {searchResults.length > 0 && (
            <Card
              position="absolute"
              left={0}
              top="full"
              shadow="xl"
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
                    onClick={() => {
                      setValue(fieldName, searchResults[i].name)
                      searchHandler(holdType, "")
                    }}
                  >
                    {result.name && <Text as="span">{result.name}</Text>}
                  </HStack>
                ))}
              </VStack>
            </Card>
          )}
          <FormErrorMessage>
            {errors.requirements && errors.requirements[index]?.name?.message}
          </FormErrorMessage>
        </FormControl>

        {holdType === "TOKEN" && (
          <FormControl
            isInvalid={
              errors.requirements && errors.requirements[index]?.tokenQuantity
            }
          >
            <FormLabel>Minimum amount to hold:</FormLabel>
            <Input
              type="number"
              {...register(`requirements.${index}.tokenQuantity`, {
                required: "This field is required.",
              })}
            />
          </FormControl>
        )}

        {holdType === "NFT" && (
          <FormControl
            isInvalid={
              errors.requirements && errors.requirements[index]?.customAttribute
            }
          >
            <FormLabel>Custom attribute:</FormLabel>
            <Input
              {...register(`requirements.${index}.customAttribute`, {
                required: "This field is required.",
              })}
            />
          </FormControl>
        )}

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

export default RequirementFormCard
