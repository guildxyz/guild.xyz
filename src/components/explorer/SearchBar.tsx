import {
  CloseButton,
  Icon,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react"
import { MagnifyingGlass } from "@phosphor-icons/react"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect, useRef, useState } from "react"

type Props = {
  placeholder?: string
  search: string
  setSearch: (value: string) => void
  rightAddon?: JSX.Element
} & InputGroupProps

const SearchBar = ({
  placeholder = "Search...",
  search,
  setSearch,
  rightAddon,
  ...rest
}: Props): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>()

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
  }, [debouncedValue, setSearch])

  const reset = () => {
    setLocalValue("")
    inputRef.current.focus()
  }

  const rightAddonBgColor = useColorModeValue("gray.50", undefined)

  return (
    <InputGroup size="lg" w="full" {...rest}>
      <InputLeftElement>
        <Icon color="#858585" size={20} as={MagnifyingGlass} />
      </InputLeftElement>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        _placeholder={{ color: "chakra-placeholder-color" }}
        fontWeight="normal"
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        id="searchBar"
        value={localValue}
        onChange={handleOnChange}
      />
      {!!rightAddon ? (
        <InputRightAddon bg={rightAddonBgColor}>{rightAddon}</InputRightAddon>
      ) : (
        localValue?.length > 0 && (
          <InputRightElement>
            <CloseButton size="sm" rounded="full" onClick={reset} />
          </InputRightElement>
        )
      )}
    </InputGroup>
  )
}

export default SearchBar
