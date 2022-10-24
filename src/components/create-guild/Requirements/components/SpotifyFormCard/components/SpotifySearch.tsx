import { FormControl, FormLabel } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import useDebouncedState from "hooks/useDebouncedState"
import { useMemo, useState } from "react"
import { useController } from "react-hook-form"
import useSpotifySearch, { SearchType } from "../hooks/useSpotifySearch"

type Props = {
  index: number
  type: SearchType
  label: string
}

const SpotifySearch = ({ index, type, label }: Props) => {
  const [searchValue, setSearchValue] = useState<string>("")
  const debouncedSearchValue = useDebouncedState(searchValue)

  const { field } = useController({
    name: `requirements.${index}.data.id`,
    rules: {
      required: `Please select a(n) ${type}`, // TODO a, an
    },
  })

  const { data, isLoading } = useSpotifySearch(debouncedSearchValue, type)

  const options = useMemo(
    () =>
      (data?.[`${type}s`]?.items ?? []).map(({ id, images, name }) => ({
        value: id,
        label: name,
        img: images?.[0]?.url,
      })),
    [data]
  )

  const selectedOption = options.find((option) => option.value === field.value)

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>

      <StyledSelect
        value={selectedOption}
        name={field.name}
        onBlur={field.onBlur}
        ref={field.ref}
        onChange={(selected) => field.onChange(selected?.value)}
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
