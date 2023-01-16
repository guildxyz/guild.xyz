import {
  CloseButton,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react"
import useDebouncedState from "hooks/useDebouncedState"
import { MagnifyingGlass } from "phosphor-react"
import { useEffect, useState } from "react"

type Props = {
  placeholder?: string
  search: string
  setSearch: (value: string) => void
}

const SearchBar = ({
  placeholder = "Search...",
  search,
  setSearch,
}: Props): JSX.Element => {
  const [localValue, setLocalValue] = useState(search)
  const debouncedValue = useDebouncedState(localValue)

  const handleOnChange = async ({ target: { value } }) => setLocalValue(value)

  // handle when search changes on router.isReady
  useEffect(() => {
    setLocalValue(search)
  }, [search])

  useEffect(() => {
    if (debouncedValue === undefined) return
    setSearch(debouncedValue)
  }, [debouncedValue])

  return (
    <InputGroup size="lg" w="full">
      <InputLeftElement>
        <Icon color="#858585" size={20} as={MagnifyingGlass} />
      </InputLeftElement>
      <Input
        placeholder={placeholder}
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        colorScheme="primary"
        id="searchBar"
        value={localValue}
        onChange={handleOnChange}
      />
      {localValue?.length > 0 && (
        <InputRightElement>
          <CloseButton size="sm" rounded="full" onClick={() => setLocalValue("")} />
        </InputRightElement>
      )}
    </InputGroup>
  )
}

export default SearchBar
