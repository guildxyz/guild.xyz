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
import useMirrorEditions from "./hooks/useMirror"

type Props = {
  index: number
  onRemove?: () => void
}

const MirrorFormCard = ({ index, onRemove }: Props): JSX.Element => {
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
    register(`requirements.${index}.address` as const, {
      shouldUnregister: true,
    })
  }, [register])

  const { isLoading, editions } = useMirrorEditions()
  const mappedEditions = useMemo(
    () =>
      editions?.map((edition) => ({
        img: edition.image, // This will be displayed as an Img tag in the list
        label: edition.title, // This will be displayed as the option text in the list
        value: edition.editionId, // This is the actual value of this select
        address: edition.editionContractAddress,
      })),
    [editions]
  )

  const type = getValues(`requirements.${index}.type`)

  // So we can show the dropdown only of the input's length is > 2
  const [valueInput, setValueInput] = useState("")

  const value = useWatch({ name: `requirements.${index}.value`, control })
  const editionById = useMemo(
    () => editions?.find((edition) => edition.editionId === value) || null,
    [editions, value]
  )

  return (
    <FormCard type="MIRROR" onRemove={onRemove}>
      <VStack
        alignItems="start"
        pb={4}
        width="full"
        borderColor="gray.600"
        borderBottomWidth={1}
      >
        <Text fontWeight="medium">Chain</Text>
        <Text fontSize="sm">Works on ETHEREUM</Text>
      </VStack>

      <FormControl
        isRequired
        isInvalid={type && errors?.requirements?.[index]?.value}
      >
        <FormLabel>Edition:</FormLabel>
        <InputGroup>
          {value && editionById && (
            <Symbol
              symbol={editionById?.image}
              isInvalid={type && errors?.requirements?.[index]?.value}
            />
          )}
          <Select
            menuIsOpen={valueInput.length > 2}
            options={mappedEditions}
            isLoading={isLoading}
            onInputChange={(text, _) => setValueInput(text)}
            value={mappedEditions?.find((edition) => edition.value === value)}
            onChange={(newValue) => {
              setValue(`requirements.${index}.value`, newValue.value)
              setValue(`requirements.${index}.address`, newValue.address)
            }}
            filterOption={(candidate, input) =>
              candidate.label.toLowerCase().includes(input?.toLowerCase())
            }
            placeholder="Search..."
            // Hiding the dropdown indicator
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
          />
        </InputGroup>
        <FormHelperText>Type at least 3 characters.</FormHelperText>
        <FormErrorMessage>
          {errors?.requirements?.[index]?.value?.message}
        </FormErrorMessage>
      </FormControl>
    </FormCard>
  )
}

export default MirrorFormCard
