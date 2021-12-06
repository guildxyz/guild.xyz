import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import { MagnifyingGlass } from "phosphor-react"
import React, { useEffect, useRef, useState } from "react"

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
  const inputTimeout = useRef(null)

  const handleOnChange = async ({ target: { value } }) => setLocalValue(value)

  // handle when search changes on router.isReady
  useEffect(() => {
    setLocalValue(search)
  }, [search])

  useEffect(() => {
    if (localValue === undefined) return
    window.clearTimeout(inputTimeout.current)
    inputTimeout.current = setTimeout(() => setSearch(localValue), 500)
  }, [localValue])

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
    </InputGroup>
  )
}

export default SearchBar
