import {
  CloseButton,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react"
import { MagnifyingGlass } from "phosphor-react"
import { Dispatch, SetStateAction, useRef } from "react"

type Props = {
  searchValue: string
  setSearchValue: Dispatch<SetStateAction<string>>
}

const FilterByRolesSearch = ({ searchValue, setSearchValue }: Props) => {
  const inputRef = useRef(null)
  const handleOnChange = async (e) => setSearchValue(e.target.value)

  const reset = () => {
    setSearchValue("")
    inputRef.current.focus()
  }

  return (
    <InputGroup>
      <InputLeftElement h="8" w="auto">
        <Icon size={10} as={MagnifyingGlass} />
      </InputLeftElement>
      <Input
        ref={inputRef}
        placeholder={"Search roles"}
        size="sm"
        variant={"unstyled"}
        value={searchValue}
        onChange={handleOnChange}
        h="8"
        pl="6"
        pr="6"
        color="initial"
      />
      {searchValue?.length > 0 && (
        <InputRightElement h="8" w="auto">
          <CloseButton size="sm" rounded="full" onClick={reset} />
        </InputRightElement>
      )}
    </InputGroup>
  )
}

export default FilterByRolesSearch
