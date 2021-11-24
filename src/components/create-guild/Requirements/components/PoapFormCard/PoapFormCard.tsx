import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  InputGroup,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Select } from "components/common/ChakraReactSelect"
import React, { useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import FormCard from "../FormCard"
import Symbol from "../Symbol"
import usePoaps from "./hooks/usePoaps"

type Props = {
  index: number
  onRemove?: () => void
}

const PoapFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const {
    getValues,
    formState: { errors },
    control,
  } = useFormContext()

  const { isLoading, poaps } = usePoaps()
  const mappedPoaps = useMemo(
    () =>
      poaps?.map((poap) => ({
        img: poap.image_url, // This will be displayed as an Img tag in the list
        label: poap.name, // This will be displayed as the option text in the list
        value: poap.fancy_id, // This is the actual value of this select
      })),
    [poaps]
  )

  const type = getValues(`requirements.${index}.type`)

  // So we can show the dropdown only of the input's length is > 0
  const [valueInput, setValueInput] = useState("")

  const value = useWatch({ name: `requirements.${index}.value` })
  const poapByFancyId = useMemo(
    () => poaps?.find((poap) => poap.fancy_id === value) || null,
    [poaps, value]
  )

  const SelectWrapperElement = useMemo(
    () => (poapByFancyId ? InputGroup : React.Fragment),
    [poapByFancyId]
  )

  return (
    <FormCard index={index} type="POAP" onRemove={onRemove}>
      <VStack
        alignItems="start"
        pb={4}
        width="full"
        borderColor="gray.600"
        borderBottomWidth={1}
      >
        <Text fontWeight="medium">Chain</Text>
        <Text fontSize="sm">Works on both ETHEREUM and XDAI</Text>
      </VStack>

      <FormControl
        isRequired
        isInvalid={type && errors?.requirements?.[index]?.value}
      >
        <FormLabel>POAP:</FormLabel>
        <SelectWrapperElement>
          {value && poapByFancyId && (
            <Symbol
              symbol={poapByFancyId?.image_url}
              isInvalid={type && errors?.requirements?.[index]?.value}
            />
          )}

          <Controller
            control={control}
            name={`requirements.${index}.value`}
            rules={{ required: "This field is required." }}
            render={({ field: { onChange, ref } }) => (
              <Select
                inputRef={ref}
                menuIsOpen={valueInput.length > 2}
                options={mappedPoaps}
                isLoading={isLoading}
                onInputChange={(text, _) => setValueInput(text)}
                value={mappedPoaps?.find((poap) => poap.value === value)}
                onChange={(newValue) => onChange(newValue.value)}
                filterOption={(candidate, input) =>
                  candidate.label.toLowerCase().startsWith(input?.toLowerCase()) ||
                  candidate.label
                    .toLowerCase()
                    .split(" ")
                    .includes(input?.toLowerCase())
                }
                placeholder="Search..."
                // Hiding the dropdown indicator
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
              />
            )}
          />
        </SelectWrapperElement>
        <FormHelperText>Type at least 3 characters.</FormHelperText>
        <FormErrorMessage>
          {errors?.requirements?.[index]?.value?.message}
        </FormErrorMessage>
      </FormControl>
    </FormCard>
  )
}

export default PoapFormCard
