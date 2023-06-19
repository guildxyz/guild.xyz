import {
  CloseButton,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react"
import { MagnifyingGlass } from "phosphor-react"
import { useRef, useState } from "react"

const IdentitiesSearch = () => {
  const inputRef = useRef<HTMLInputElement>()
  const [value, setValue] = useState("")

  const handleOnChange = async (e) => setValue(e.target.value)

  const reset = () => {
    setValue("")
    inputRef.current.focus()
  }

  return (
    <InputGroup>
      <InputLeftElement h="8" w="auto">
        <Icon size={14} as={MagnifyingGlass} />
      </InputLeftElement>
      <Input
        ref={inputRef}
        placeholder={"Search members"}
        // whiteSpace="nowrap"
        // textOverflow="ellipsis"
        value={value}
        variant={"unstyled"}
        onChange={handleOnChange}
        h="8"
        pl="6"
        pr="6"
        color="initial"
      />
      {value?.length > 0 && (
        <InputRightElement h="8" w="auto">
          <CloseButton size="sm" rounded="full" onClick={reset} />
        </InputRightElement>
      )}
    </InputGroup>
  )
}

export default IdentitiesSearch
