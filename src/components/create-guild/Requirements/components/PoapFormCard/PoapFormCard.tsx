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
import { GuildFormType, Requirement, SelectOption } from "types"
import ChainInfo from "../ChainInfo"
import usePoaps from "./hooks/usePoaps"

type Props = {
  index: number
  field: Requirement
}

const customFilterOption = (candidate, input) =>
  candidate.label.toLowerCase().includes(input?.toLowerCase())

const PoapFormCard = ({ index, field }: Props): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const type = useWatch({ name: `requirements.${index}.type` })

  const { isLoading, poaps } = usePoaps()
  const mappedPoaps = useMemo(
    () =>
      poaps?.map((poap) => ({
        img: poap.image_url, // This will be displayed as an Img tag in the list
        label: poap.name, // This will be displayed as the option text in the list
        value: poap.fancy_id, // This is the actual value of this select
        details: `#${poap.id}`,
      })),
    [poaps]
  )

  const dataId = useWatch({ name: `requirements.${index}.data.id`, control })
  const poapByFancyId = useMemo(
    () => poaps?.find((poap) => poap.fancy_id === dataId) || null,
    [poaps, dataId]
  )

  return (
    <>
      <ChainInfo>Works on both ETHEREUM and GNOSIS</ChainInfo>

      <FormControl
        isRequired
        isInvalid={type && !!errors?.requirements?.[index]?.data?.id}
      >
        <FormLabel>POAP:</FormLabel>
        <InputGroup>
          {dataId && poapByFancyId && (
            <InputLeftElement>
              <OptionImage
                img={poapByFancyId?.image_url}
                alt={poapByFancyId?.name}
              />
            </InputLeftElement>
          )}
          <Controller
            name={`requirements.${index}.data.id` as const}
            control={control}
            defaultValue={field.data?.id}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value: selectValue, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                isLoading={isLoading}
                options={mappedPoaps}
                placeholder="Search..."
                value={mappedPoaps?.find((poap) => poap.value === selectValue)}
                defaultValue={mappedPoaps?.find(
                  (poap) => poap.value === field.data?.id
                )}
                onChange={(newValue: SelectOption) => onChange(newValue?.value)}
                onBlur={onBlur}
                filterOption={customFilterOption}
              />
            )}
          />
        </InputGroup>

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default PoapFormCard
