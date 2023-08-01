import {
  CloseButton,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react"
import useDebouncedState from "hooks/useDebouncedState"
import { MagnifyingGlass } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import { Rest } from "types"

type Props = {
  placeholder?: string
  search: string
  setSearch: (value: string) => void
  rightAddon?: JSX.Element
} & Rest

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
  }, [debouncedValue])

  const reset = () => {
    setLocalValue("")
    inputRef.current.focus()
  }

  const rightAddonBgColor = useColorModeValue("gray.50", undefined)
  // needed so there's no transparent state in dark mode when the input is becoming stuck
  const bgColor = useColorModeValue("white", "gray.800")

  return (
    <InputGroup size="lg" w="full" bg={bgColor} borderRadius={"xl"}>
      <InputLeftElement>
        <Icon color="#858585" size={20} as={MagnifyingGlass} />
      </InputLeftElement>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        colorScheme="primary"
        id="searchBar"
        value={localValue}
        onChange={handleOnChange}
        {...rest}
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
