import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Img,
  Input,
  Spinner,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import Select from "components/common/ChakraReactSelect/ChakraReactSelect"
import CloseButton from "components/common/CloseButton"
import { useMemo, useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
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

  const poapValue = useWatch({ name: `requirements.${index}.value` })

  const poapByFancyId = () =>
    poapsList?.find((poap) => poap.fancy_id === poapValue) || null

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
          isRequired
          isInvalid={
            type &&
            errors.requirements &&
            errors.requirements[index] &&
            errors.requirements[index].value
          }
        >
          <FormLabel>Search for a POAP:</FormLabel>
          <HStack>
            {poapValue && (
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
                {poapByFancyId() ? (
                  <Img
                    src={poapByFancyId()?.image_url}
                    boxSize={6}
                    minWidth={6}
                    minHeight={6}
                    mt={2}
                    rounded="full"
                  />
                ) : (
                  <HStack px={4} h={10} alignContent="center">
                    <Spinner size="sm" color="whiteAlpha.400" />
                  </HStack>
                )}
              </Box>
            )}
            <Select
              onChange={(selectedOption) => {
                setValue(`requirements.${index}.value`, selectedOption.value)
              }}
              onInputChange={(text) => searchHandler(text)}
              options={searchResults.map((option) => ({
                img: option.image_url, // This will be displayed as an Img tag in the list
                label: option.name, // This will be displayed as the option text in the list
                value: option.fancy_id, // This will be passed to the hidden input
              }))}
            />
          </HStack>
          <Input
            type="hidden"
            {...register(`requirements.${index}.value`, {
              required: "This field is required.",
            })}
          />
          <FormHelperText>Type at least 3 characters.</FormHelperText>
          <FormErrorMessage>
            {errors.requirements && errors.requirements[index]?.value?.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
    </Card>
  )
}

export default PoapFormCard
