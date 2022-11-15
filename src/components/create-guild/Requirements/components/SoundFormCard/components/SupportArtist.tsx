import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Requirement, SelectOption } from "types"
import { useSoundArtists } from "../hooks/useSound"

const SupportArtist = ({ index }: { index: number; field?: Requirement }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const [search, setSearch] = useState(
    useWatch({ name: `requirements.${index}.data.id` })
  )

  const { artists, isLoading } = useSoundArtists(search)

  const artistOptions = artists?.map((artist) => ({
    label: artist[0].name,
    value: artist[0].soundHandle,
    img: artist[0].image,
  }))

  return (
    <>
      <FormControl isRequired isInvalid={errors?.requirements?.[index]?.data?.id}>
        <FormLabel>SoundHande:</FormLabel>
        <Controller
          name={`requirements.${index}.data.id` as const}
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
              onInputChange={(inputValue) => setSearch(inputValue.split(".")[0])}
              isLoading={isLoading}
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
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default SupportArtist
