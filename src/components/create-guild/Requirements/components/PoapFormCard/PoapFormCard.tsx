import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
} from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect"
import { useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
import FormCard from "../FormCard"
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
    formState: { errors },
    control,
  } = useFormContext()

  // Set up default value if needed
  const defaultValuePlaceholder = getValues(`requirements.${index}.value`)

  const type = getValues(`requirements.${index}.type`)

  // So we can show the dropdown only of the input's length is > 0
  const [valueInput, setValueInput] = useState("")

  const value = useWatch({ name: `requirements.${index}.value` })
  const poapByFancyId = useMemo(
    () => poaps?.find((poap) => poap.fancy_id === value) || null,
    [poaps, value]
  )

  return (
    <FormCard color={RequirementTypeColors.POAP} onRemove={onRemove}>
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
                options={poaps?.map((poap) => ({
                  img: poap.image_url, // This will be displayed as an Img tag in the list
                  label: poap.name, // This will be displayed as the option text in the list
                  value: poap.fancy_id, // This is the actual value of this select
                }))}
                isLoading={isLoading}
                onInputChange={(text, _) => setValueInput(text)}
                onChange={(newValue) => onChange(newValue.value)}
                shouldShowArrow={false}
                filterOption={(candidate, input) =>
                  candidate.label.toLowerCase().startsWith(input?.toLowerCase()) ||
                  candidate.label
                    .toLowerCase()
                    .split(" ")
                    .includes(input?.toLowerCase())
                }
                placeholder={defaultValuePlaceholder || "Search..."}
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
    </FormCard>
  )
}

export default PoapFormCard
