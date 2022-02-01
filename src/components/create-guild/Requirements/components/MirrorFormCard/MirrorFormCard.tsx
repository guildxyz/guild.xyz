import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import React, { useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormField, SelectOption } from "types"
import ChainInfo from "../ChainInfo"
import useMirrorEditions from "./hooks/useMirror"

type Props = {
  index: number
  field: RequirementFormField
}

const customFilterOption = (candidate, input) =>
  candidate?.label?.toLowerCase().includes(input?.toLowerCase()) ||
  candidate?.value?.toString().startsWith(input) ||
  candidate?.data?.address?.toLowerCase() === input.toLowerCase()

const MirrorFormCard = ({ index, field }: Props): JSX.Element => {
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
        details: `#${edition.editionId}`,
        address: edition.editionContractAddress,
      })),
    [editions]
  )

  const editionById = useMemo(
    () =>
      editions?.find(
        (edition) =>
          edition.editionId === value && edition.editionContractAddress === address
      ) || null,
    [editions, value, address]
  )

  return (
    <>
      <ChainInfo>Works on ETHEREUM</ChainInfo>

      <FormControl
        isRequired
        isInvalid={type && errors?.requirements?.[index]?.value}
      >
        <FormLabel>Edition:</FormLabel>
        <InputGroup>
          {value && editionById && (
            <InputLeftElement>
              <OptionImage img={editionById?.image} alt={editionById?.title} />
            </InputLeftElement>
          )}
          <Controller
            name={`requirements.${index}.value` as const}
            control={control}
            defaultValue={field.value}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value: selectValue, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                isLoading={isLoading}
                options={mappedEditions}
                placeholder="Search..."
                value={mappedEditions?.find(
                  (edition) =>
                    edition.value == selectValue &&
                    edition.address?.toLowerCase() === address
                )}
                defaultValue={mappedEditions?.find(
                  (edition) =>
                    edition.value == field.value &&
                    edition.address?.toLowerCase() === field.address
                )}
                onChange={(newValue: SelectOption) => {
                  onChange(newValue?.value)
                  setValue(`requirements.${index}.address`, newValue?.address)
                }}
                onBlur={onBlur}
                filterOption={customFilterOption}
              />
            )}
          />
        </InputGroup>

        <FormErrorMessage>
          {errors?.requirements?.[index]?.value?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default MirrorFormCard
