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
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { useMemo, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
import usePoapsList from "./hooks/usePoapsList"

type Props = {
  index: number
  onRemove?: () => void
}

const PoapFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const poapsList = usePoapsList()
  const {
    trigger,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext()
  const type = getValues(`requirements.${index}.type`)

  const { colorMode } = useColorMode()

  const inputTimeout = useRef(null)
  const [searchInput, setSearchInput] = useState("")

  const searchResults = useMemo(() => {
    if (searchInput.length < 3) return []

    const searchText = searchInput.toLowerCase()
    const foundPoaps =
      poapsList?.filter((poap) => poap.name.toLowerCase().startsWith(searchText)) ||
      []

    return foundPoaps
  }, [searchInput, poapsList])

  const searchHandler = (text: string) => {
    window.clearTimeout(inputTimeout.current)
    inputTimeout.current = setTimeout(() => setSearchInput(text), 300)
  }

  const searchResultClickHandler = (resultIndex: number) => {
    setValue(`requirements.${index}.value`, searchResults[resultIndex].fancy_id)
    searchHandler("")
    trigger(`requirements.${index}.value`)
  }

  const poapByFancyId = () =>
    poapsList.find(
      (poap) => poap.fancy_id === getValues(`requirements.${index}.value`)
    )

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
          width={8}
          height={8}
          rounded="full"
          zIndex="docked"
          aria-label="Remove level"
          onClick={onRemove}
        />
      )}
      <VStack spacing={4} alignItems="start">
        <FormControl
          isRequired
          isInvalid={
            type &&
            errors.requirements &&
            errors.requirements[index] &&
            errors.requirements[index].value
          }
        >
          <FormLabel>Search for a POAP:</FormLabel>
          <InputGroup>
            {getValues(`requirements.${index}.value`) && (
              <InputLeftAddon>
                {(poapByFancyId() && (
                  <Img src={poapByFancyId()?.image_url} boxSize={6} rounded="full" />
                )) || <Spinner />}
              </InputLeftAddon>
            )}
            <Input
              {...register(`requirements.${index}.value`, {
                required: "This field is required.",
              })}
              autoComplete="off"
              onChange={(e) => searchHandler(e.target.value)}
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
                    <Img boxSize={6} rounded="full" src={result.image_url} />
                    <Text fontWeight="semibold" as="span">
                      {result.name}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Card>
          )}
          <FormErrorMessage>
            {errors.requirements && errors.requirements[index]?.value?.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
    </Card>
  )
}

export default PoapFormCard
