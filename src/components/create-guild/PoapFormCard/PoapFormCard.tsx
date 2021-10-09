import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  VStack,
} from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect/ChakraReactSelect"
import ColorCard from "components/common/ColorCard"
import { useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
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
    trigger,
    getValues,
    setValue,
    formState: { errors },
    control,
  } = useFormContext()

  const type = getValues(`requirements.${index}.type`)

  // So we can show the dropdown only of the input's length is > 0
  const [valueInput, setValueInput] = useState("")

  const value = useWatch({ name: `requirements.${index}.value` })
  const poapByFancyId = useMemo(
    () => poaps?.find((poap) => poap.fancy_id === value) || null,
    [poaps, value]
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
            {value && poapByFancyId && <Symbol symbol={poapByFancyId?.image_url} />}
            <Controller
              control={control}
              name={`requirements.${index}.value`}
              rules={{ required: "This field is required." }}
              render={({ field: { onChange, ref } }) => (
                <Select
                  inputRef={ref}
                  menuIsOpen={valueInput.length > 2}
                  options={poaps?.map((option) => ({
                    img: option.image_url, // This will be displayed as an Img tag in the list
                    label: option.name, // This will be displayed as the option text in the list
                    value: option.fancy_id, // This will be passed to the hidden input
                  }))}
                  isLoading={isLoading}
                  onInputChange={(text, _) => setValueInput(text)}
                  onChange={(newValue) => {
                    setValue(`requirements.${index}.value`, newValue.value)
                  }}
                  shouldShowArrow={false}
                  filterOption={(candidate, input) =>
                    candidate.label.toLowerCase().startsWith(input?.toLowerCase())
                  }
                  placeholder="Search..."
                  onBlur={() => trigger(`requirements.${index}.value`)}
                />
              )}
            />
          </HStack>
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
