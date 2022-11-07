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
import { useFetcherWithSign } from "utils/fetcher"

type Props = {
  index: number
  type: "album" | "artist" | "playlist" | "track" | "show" | "episode" | "audiobook"
  label: string
}

const LINK_REGEX =
  /^(?:https\:\/\/)?(?:www\.)?open\.spotify\.com\/([a-z]*)\/(.*?)(?:\?.*)?$/

const MAYBE_ID_REGEX = /^[a-z0-9]{22}$/i

const SpotifySearch = ({ index, type, label }: Props) => {
  const { setValue, setError } = useFormContext()

  const requirementLabel = useWatch({
    name: `requirements.${index}.data.params.label`,
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
  const [options, setOptions] = useState([])

  useEffect(() => {
    if (gateables) {
      setOptions(gateables)
    }
  }, [gateables])

  const selectOption = (option) => {
    setValue(`requirements.${index}.data.id`, option?.value)
    setValue(`requirements.${index}.data.params.label`, option?.label)
    setValue(`requirements.${index}.data.params.img`, option?.img)
    if (option?.details) {
      setValue(`requirements.${index}.data.params.artist`, option?.details)
    }
    field.onChange(option?.value)
  }

  const { field } = useController({
    name: `requirements.${index}.data.id`,
    defaultValue: "",
    rules: {
      required: "This field is required",
      validate: () => {
        if (invalidLink) {
          return "Invalid link"
        }
        return true
      },
    },
  })

  const selectedOption = options.find((option) => option.value === field.value)

  const fetcherWithSign = useFetcherWithSign()

  const [invalidLink, setInvalidLink] = useState<boolean>(false)

  return (
    <>
      <FormControl isInvalid={!!errors?.requirements?.[index]?.data?.id?.message}>
        <FormLabel>Search for a(n) {type}</FormLabel>

        <StyledSelect
          value={selectedOption}
          onChange={(selected) => selectOption(selected)}
          name={field.name}
          onBlur={field.onBlur}
          ref={field.ref}
          filterOption={() => true}
          options={options}
          isLoading={isValidating}
          onInputChange={(val, { action }) => {
            if (action !== "input-blur" && action !== "menu-close") {
              setInvalidLink(false)
              let parsedId = null
              let parsedType = null
              let linkMatched = false
              let idMatched = false

              if (LINK_REGEX.test(val)) {
                const match = val.match(LINK_REGEX)
                parsedType = match[1].trim()
                parsedId = match[2].trim()
                linkMatched = true
              } else if (MAYBE_ID_REGEX.test(val)) {
                parsedId = val.trim()
                idMatched = true
              }

              if (linkMatched || idMatched) {
                if (linkMatched && parsedType !== type) {
                  setSearchValue(val)
                  setInvalidLink(true)
                } else {
                  fetcherWithSign("/guild/listGateables", {
                    method: "POST",
                    body: { platformName: "SPOTIFY", id: parsedId, type: type },
                  })
                    .then(
                      (res: {
                        value: string
                        label: string
                        img?: string
                        details?: string
                      }) => {
                        setSearchValue("")
                        setOptions([res])
                        selectOption(res)
                      }
                    )
                    .catch(() => setSearchValue(val))
                }
              } else {
                setSearchValue(val)
              }
            }
          }}
          inputValue={searchValue}
          placeholder="Search..."
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default SpotifySearch
