import Icon from "@chakra-ui/icon"
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input"
import { MagnifyingGlass } from "phosphor-react"
import React, { useRef } from "react"

const SearchBar = ({ setSearchInput }) => {
  const inputTimeout = useRef(null)
  const handleOnChange = async ({ target: { value } }) => {
    window.clearTimeout(inputTimeout.current)
    inputTimeout.current = setTimeout(() => setSearchInput(value), 300)
  }

  return (
    <InputGroup size="lg" mb={16}>
      <InputLeftElement>
        <Icon color="#858585" size={20} as={MagnifyingGlass} />
      </InputLeftElement>
      <Input
        placeholder="Search guilds"
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        colorScheme="primary"
        onChange={handleOnChange}
      />
    </InputGroup>
  )
}

export default SearchBar
