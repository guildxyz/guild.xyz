import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import { ControlledCombobox } from "components/zag/Combobox"
import { PropsWithChildren, useState } from "react"
import { useFormState, useWatch } from "react-hook-form"
import useSWRImmutable from "swr/immutable"
import { Requirement } from "types"
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
  const { errors } = useFormState()

  const id = useWatch({ name: `${baseFieldPath}.data.id` })

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

      <ControlledCombobox
        name={`${baseFieldPath}.data.id`}
        rules={{ required: "This field is required." }}
        isClearable
        options={artistOptions}
        placeholder="Search for an artist"
        afterOnChange={(newValue) => onChangeFn?.(newValue?.value)}
        onInputChange={(text) => setSearch(text ? splitInput(text) : "")}
        isLoading={artistsLoading}
        fallbackValue={
          id && {
            label: id,
            value: id,
          }
        }
        noOptionsText={
          !search?.length
            ? "Start typing..."
            : artistsLoading
            ? "Loading..."
            : "No results"
        }
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default SoundArtistSelect
