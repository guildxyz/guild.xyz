import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import useDebouncedState from "hooks/useDebouncedState"
import useGateables from "hooks/useGateables"
import { useEffect, useState } from "react"
import {
  useController,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"

type Props = {
  index: number
  type: "album" | "artist" | "playlist" | "track" | "show" | "episode" | "audiobook"
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

  const { errors } = useFormState()

  const [searchValue, setSearchValue] = useState<string>("")
  useEffect(() => setSearchValue(requirementLabel), [])
  const debouncedSearchValue = useDebouncedState(searchValue)

  const { isValidating, gateables } = useGateables(
    "SPOTIFY",
    undefined,
    {
      q: debouncedSearchValue,
      type,
    },
    typeof debouncedSearchValue === "string" && debouncedSearchValue.length > 0
  )
  const options = gateables ?? []

  const selectedOption = options.find((option) => option.value === field.value)

  return (
    <FormControl isInvalid={!!errors?.requirements?.[index]?.data?.id?.message}>
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
            setValue(`requirements.${index}.data.params.artist`, selected?.details)
          }
          field.onChange(selected?.value)
        }}
        isClearable
        options={options}
        isLoading={isValidating}
        onInputChange={(val, { action }) => {
          if (action !== "input-blur" && action !== "menu-close") {
            setSearchValue(val)
          }
        }}
        inputValue={searchValue}
        placeholder="Search..."
      />

      <FormErrorMessage>
        {errors?.requirements?.[index]?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default SpotifySearch
