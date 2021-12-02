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
import { RequirementFormField } from "temporaryData/types"
import FormCard from "../FormCard"
import Symbol from "../Symbol"
import useMirrorEditions from "./hooks/useMirror"

type Props = {
  index: number
  field: RequirementFormField
  onRemove?: () => void
}

const MirrorFormCard = ({ index, field, onRemove }: Props): JSX.Element => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `requirements.${index}.type` })
  const value = useWatch({ name: `requirements.${index}.value` })
  const address = useWatch({ name: `requirements.${index}.address` })

  const { isLoading, editions } = useMirrorEditions()
  const mappedEditions = useMemo(
    () =>
      editions?.map((edition) => ({
        img: edition.image,
        label: edition.title,
        value: edition.editionId,
        address: edition.editionContractAddress,
      })),
    [editions]
  )

  // So we can show the dropdown only of the input's length is > 2
  const [valueInput, setValueInput] = useState("")

  const editionById = useMemo(
    () =>
      editions?.find(
        (edition) =>
          edition.editionId === value && edition.editionContractAddress === address
      ) || null,
    [editions, value, address]
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
          <Controller
            name={`requirements.${index}.value` as const}
            control={control}
            defaultValue={field.value}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value: selectValue, ref } }) => (
              <Select
                ref={ref}
                isClearable
                isLoading={isLoading}
                options={mappedEditions}
                placeholder="Search..."
                value={mappedEditions?.find(
                  (edition) =>
                    edition.value === selectValue &&
                    edition.address === field.address
                )}
                defaultValue={mappedEditions?.find(
                  (edition) =>
                    edition.value === field.value &&
                    edition.address === field.address
                )}
                onChange={(newValue) => {
                  onChange(newValue?.value)
                  setValue(`requirements.${index}.address`, newValue?.address)
                }}
                onBlur={onBlur}
                menuIsOpen={valueInput.length > 2}
                onInputChange={(text, _) => setValueInput(text)}
                filterOption={(candidate, input) =>
                  candidate.label.toLowerCase().includes(input?.toLowerCase())
                }
                // Hiding the dropdown indicator
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
              />
            )}
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
