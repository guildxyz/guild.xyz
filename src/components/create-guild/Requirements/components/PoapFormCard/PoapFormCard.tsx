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
import React, { useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import FormCard from "../FormCard"
import Symbol from "../Symbol"
import usePoaps from "./hooks/usePoaps"

type Props = {
  index: number
  onRemove?: () => void
}

const PoapFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
    control,
  } = useFormContext()

  useEffect(() => {
    // Registering these inputs this way instead of using a Controller component (or useController), because some fields remained in the fieldsarray even after we removed them, which caused bugs in the application
    register(`requirements.${index}.value` as const, {
      required: "This field is required.",
      shouldUnregister: true,
    })
  }, [register])

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

  const value = useWatch({ name: `requirements.${index}.value`, control })
  const poapByFancyId = useMemo(
    () => poaps?.find((poap) => poap.fancy_id === value) || null,
    [poaps, value]
  )

  const SelectWrapperElement = useMemo(
    () => (poapByFancyId ? InputGroup : React.Fragment),
    [poapByFancyId]
  )

  return (
    <FormCard type="POAP" onRemove={onRemove}>
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
          <Select
            menuIsOpen={valueInput.length > 2}
            options={mappedPoaps}
            isLoading={isLoading}
            onInputChange={(text, _) => setValueInput(text)}
            value={mappedPoaps?.find((poap) => poap.value === value)}
            onChange={(newValue) =>
              setValue(`requirements.${index}.value`, newValue.value)
            }
            filterOption={(candidate, input) =>
              candidate.label.toLowerCase().startsWith(input?.toLowerCase()) ||
              candidate.label.toLowerCase().split(" ").includes(input?.toLowerCase())
            }
            placeholder="Search..."
            // Hiding the dropdown indicator
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
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
