import { FormControl, FormLabel } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect, useMemo, useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import useSpotifySearch, { SearchType } from "../hooks/useSpotifySearch"

type Props<T extends SearchType> = {
  index: number
  type: T
  requirementDataType?: `${T}s` | T
  label: string
}

const SpotifySearch = <T extends SearchType>({
  index,
  type,
  requirementDataType,
  label,
}: Props<T>) => {
  const [searchValue, setSearchValue] = useState<string>("")
  const debouncedSearchValue = useDebouncedState(searchValue)

  const { field } = useController({
    name: `requirements.${index}.data.id`,
    rules: {
      required: `Please select a(n) ${type}`, // TODO a, an
    },
  })

  const { setValue } = useFormContext()

  useEffect(() => {
    console.log(`requirements.${index}.data.type`, requirementDataType)
    setValue(`requirements.${index}.data.type`, requirementDataType)

    return () => setValue(`requirements.${index}.data.type`, undefined)
  }, [requirementDataType])

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
