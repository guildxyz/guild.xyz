import { useColorMode } from "@chakra-ui/color-mode"
import Icon from "@chakra-ui/icon"
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input"
import React, { useRef } from "react"
import Search from "static/icons/search.svg"

const SearchBar = ({ setSearchInput }) => {
  const { colorMode } = useColorMode()
  const inputTimeout = useRef(null)
  const handleOnChange = async ({ target: { value } }) => {
    window.clearTimeout(inputTimeout.current)
    inputTimeout.current = setTimeout(() => setSearchInput(value), 300)
  }

  return (
    <InputGroup size="lg" mb={16} maxW="600px">
      <InputLeftElement>
        <Icon color="#858585" size={20} as={Search} />
      </InputLeftElement>
      <Input
        placeholder="Search guilds"
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        colorScheme="primary"
        borderRadius="15px"
        bg={colorMode === "light" ? "white" : "gray.900"}
        onChange={handleOnChange}
      />
    </InputGroup>
  )
}

export default SearchBar
