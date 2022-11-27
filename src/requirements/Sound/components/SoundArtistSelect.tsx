import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { PropsWithChildren, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import useSWRImmutable from "swr/immutable"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPathProp: string
  handleArtistId?: (id: string) => void
}

const ArtistSelect = ({
  baseFieldPathProp,
  handleArtistId,
}: PropsWithChildren<Props>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const [search, setSearch] = useState(
    useWatch({ name: `${baseFieldPathProp}.data.id` })
  )

  // const handle = useWatch({ name: `${baseFieldPathProp}.data.id` })

  const { data: artistsData, isValidating: artistsLoading } = useSWRImmutable(
    search?.length > 0 ? `/api/sound-artists?searchQuery=${search}` : null
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
    <>
      <FormControl
        isRequired
        isInvalid={parseFromObject(errors, baseFieldPathProp)?.data?.id}
      >
        <FormLabel>Artist:</FormLabel>
        <Controller
          name={`${baseFieldPathProp}.data.id` as const}
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
                if (handleArtistId)
                  handleArtistId(
                    artistsData?.find(
                      (artist) => artist.soundHandle == newSelectedOption?.value
                    ).id
                  )
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
          {parseFromObject(errors, baseFieldPathProp)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default ArtistSelect
