import { FormControl, FormLabel } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect, useState } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import useSpotifySearchOptions, {
  SearchType,
} from "../hooks/useSpotifySearchOptions"

type Props = {
  index: number
  type: SearchType
  label: string
}

const SpotifySearch = ({ index, type, label }: Props) => {
  const { setValue } = useFormContext()

  const requirementLabel = useWatch({
    name: `requirements.${index}.data.params.label`,
  })

  const { field } = useController({
    name: `requirements.${index}.data.id`,
    rules: {
      required: `Please select a(n) ${type}`, // TODO a, an
    },
  })

  const [searchValue, setSearchValue] = useState<string>("")
  useEffect(() => setSearchValue(requirementLabel), [])
  const debouncedSearchValue = useDebouncedState(searchValue)

  const { options, isLoading } = useSpotifySearchOptions(debouncedSearchValue, type)

  const selectedOption = options.find((option) => option.value === field.value)

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>

      <StyledSelect
        value={selectedOption}
        name={field.name}
        onBlur={field.onBlur}
        ref={field.ref}
        onChange={(selected) => {
          setValue(`requirements.${index}.data.params.label`, selected?.label)
          setValue(`requirements.${index}.data.params.img`, selected?.img)
          if (selected?.details) {
            setValue(
              `requirements.${index}.data.params.spotifyArtist`,
              selected?.details
            )
          }
          field.onChange(selected?.value)
        }}
        isClearable
        options={options}
        isLoading={isLoading}
        onInputChange={(val) => setSearchValue(val)}
        inputValue={searchValue}
        placeholder="Search..."
      />
    </FormControl>
  )
}

export default SpotifySearch
