import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"

import parseFromObject from "utils/parseFromObject"

const SupportArtist = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const [search, setSearch] = useState(
    useWatch({ name: `${baseFieldPath}.data.id` })
  )

  const { data: artistsData, isValidating: artistsLoading } = useSWRImmutable(
    search?.length > 0 ? `/api/sound-artists?searchQuery=${search}` : null
  )

  const artistOptions = artistsData?.map((artist) => ({
    label: artist[0].name,
    value: artist[0].soundHandle,
    img: artist[0].image,
  }))

  const splitInput = (inputValue) => {
    const split = inputValue.split("/")
    return split[split.length - 1]
  }

  return (
    <>
      <FormControl
        isRequired
        isInvalid={parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>Artist:</FormLabel>
        <Controller
          name={`${baseFieldPath}.data.id` as const}
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              options={artistOptions}
              placeholder="Search for an artist"
              value={artistOptions?.find((option) => option.value === value)}
              onChange={(newSelectedOption: SelectOption) => {
                onChange(newSelectedOption?.value)
              }}
              onInputChange={(text, _) => {
                setSearch(splitInput(text))
              }}
              isLoading={artistsLoading}
              onBlur={onBlur}
              // so restCount stays visible
              filterOption={() => true}
              menuIsOpen={search ? undefined : false}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
            />
          )}
        />
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default SupportArtist
