import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect/ChakraReactSelect"
import ColorCard from "components/common/ColorCard"
import { useMemo, useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
import Symbol from "../Symbol"
import usePoaps from "./hooks/usePoaps"

type Props = {
  index: number
  onRemove?: () => void
}

const PoapFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const { isLoading, poaps } = usePoaps()

  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext()
  const type = getValues(`requirements.${index}.type`)

  const inputTimeout = useRef(null)
  const [searchInput, setSearchInput] = useState("")

  const searchResults = useMemo(() => {
    if (searchInput.length < 3) return []

    const searchText = searchInput.toLowerCase()
    const foundPoaps =
      poaps?.filter((poap) => poap.name.toLowerCase().startsWith(searchText)) || []

    return foundPoaps
  }, [searchInput, poaps])

  const searchHandler = (text: string) => {
    window.clearTimeout(inputTimeout.current)
    inputTimeout.current = setTimeout(() => setSearchInput(text), 300)
  }

  const poapValue = useWatch({ name: `requirements.${index}.value` })

  const poapByFancyId = useMemo(
    () => poaps?.find((poap) => poap.fancy_id === poapValue) || null,
    [poaps, poapValue]
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
          isRequired
          isInvalid={type && errors?.requirements?.[index]?.value}
        >
          <FormLabel>Search for a POAP:</FormLabel>
          <HStack>
            {poapValue && poapByFancyId && (
              <Symbol symbol={poapByFancyId?.image_url} />
            )}
            <Select
              menuIsOpen={searchInput.length > 2}
              isLoading={isLoading}
              onChange={(selectedOption) => {
                setValue(`requirements.${index}.value`, selectedOption.value)
              }}
              onInputChange={(text) => searchHandler(text)}
              options={searchResults.map((option) => ({
                img: option.image_url, // This will be displayed as an Img tag in the list
                label: option.name, // This will be displayed as the option text in the list
                value: option.fancy_id, // This will be passed to the hidden input
              }))}
              shouldShowArrow={false}
              filterOption={(data) => data}
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
            {errors?.requirements?.[index]?.value?.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
    </ColorCard>
  )
}

export default PoapFormCard
