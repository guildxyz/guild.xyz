import {
  CloseButton,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react"
import { Column, FilterFn } from "@tanstack/react-table"
import useDebouncedState from "hooks/useDebouncedState"
import { MagnifyingGlass } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import { Member } from "./CRMTable"

export const identitiesFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const { addresses, platformUsers } = row.getValue(columnId) as Member

  if (
    platformUsers.some((platformAccount) =>
      platformAccount.username?.toLowerCase().includes(value)
    ) ||
    addresses.some((address) => address.toLowerCase().includes(value))
  )
    return true

  return false
}

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
  }, [debouncedValue])

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
        // whiteSpace="nowrap"
        // textOverflow="ellipsis"
        value={localValue}
        variant={"unstyled"}
        onChange={handleOnChange}
        h="8"
        pl="6"
        pr="6"
        color="initial"
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
