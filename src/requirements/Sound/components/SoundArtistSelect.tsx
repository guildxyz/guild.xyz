import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import CustomMenuList from "components/common/StyledSelect/components/CustomMenuList"
import { PropsWithChildren, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import useSWRImmutable from "swr/immutable"
import { Requirement, SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
  field?: Requirement
  onChange?: (selectedOption: string) => void
}

const SoundArtistSelect = ({
  baseFieldPath,
  field,
  onChange: onChangeFn,
}: PropsWithChildren<Props>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const [search, setSearch] = useState(field?.data?.id)

  const { data: artistsData, isValidating: artistsLoading } = useSWRImmutable(
    search?.length > 0 ? `/api/sound/sound-artists?searchQuery=${search}` : null
  )

  const artistOptions = artistsData?.map((artist) => ({
    label: artist.name,
    value: artist.soundHandle,
    img: artist.image,
  }))

  const splitInput = (inputValue) => {
    const split = inputValue.split("/")
    return split[split.length - 1]
  }

  return (
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
              onChange(newSelectedOption?.value ?? null)
              onChangeFn?.(newSelectedOption?.value)
            }}
            onInputChange={(text, _) => setSearch(text ? splitInput(text) : "")}
            isLoading={artistsLoading}
            onBlur={onBlur}
            components={{
              MenuList: (props) => (
                <CustomMenuList
                  {...props}
                  noResultText={
                    !search?.length
                      ? "Start typing..."
                      : artistsLoading
                      ? "Loading..."
                      : "No results"
                  }
                />
              ),
            }}
          />
        )}
      />
      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default SoundArtistSelect
