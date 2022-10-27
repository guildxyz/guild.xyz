import { FormControl, FormLabel } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import useDebouncedState from "hooks/useDebouncedState"
import { useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import useSpotifySearchOptions, {
  SearchType,
} from "../hooks/useSpotifySearchOptions"

type Props = {
  index: number
  type: SearchType
  label: string
}

const SpotifySearch = ({ index, type, label }: Props) => {
  const [searchValue, setSearchValue] = useState<string>("")
  const debouncedSearchValue = useDebouncedState(searchValue)

  const { setValue } = useFormContext()

  const { field } = useController({
    name: `requirements.${index}.data.id`,
    rules: {
      required: `Please select a(n) ${type}`, // TODO a, an
    },
  })

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
          setValue(`requirements.${index}.data.label`, selected?.label)
          setValue(`requirements.${index}.data.img`, selected?.img)
          field.onChange(selected?.value)
        }}
        isClearable
        options={options}
        isLoading={isLoading}
        onInputChange={(val) => setSearchValue(val)}
        inputValue={searchValue}
        placeholder="Search..."
        isSearchable
      />
    </FormControl>
  )
}

export default SpotifySearch
