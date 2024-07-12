import {
  CloseButton,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react"
import { Column } from "@tanstack/react-table"
import useDebouncedState from "hooks/useDebouncedState"
import { MagnifyingGlass } from "phosphor-react"
import { useEffect, useRef, useState } from "react"

type Props = {
  column: Column<any>
}

const IdentitiesSearch = ({ column }: Props) => {
  const inputRef = useRef<HTMLInputElement>()
  const [localValue, setLocalValue] = useState(column.getFilterValue() as string)
  const debouncedValue = useDebouncedState(localValue)

  const handleOnChange = async (e) => setLocalValue(e.target.value)

  useEffect(() => {
    if (debouncedValue === undefined) return
    column.setFilterValue(debouncedValue.toLowerCase())
  }, [debouncedValue, column])

  const reset = () => {
    setLocalValue("")
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
        noOfLines={1}
        value={localValue ?? ""}
        variant={"unstyled"}
        onChange={handleOnChange}
        h="8"
        pl="6"
        pr="6"
        color="var(--chakra-colors-chakra-body-text)"
      />
      {localValue?.length > 0 && (
        <InputRightElement h="8" w="auto">
          <CloseButton size="sm" rounded="full" onClick={reset} />
        </InputRightElement>
      )}
    </InputGroup>
  )
}

export default IdentitiesSearch
