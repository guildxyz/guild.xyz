import { useEffect, useRef, useState } from "react"
import fetcher from "utils/fetcher"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import { Filter, SupportedQueryParam } from "./ActivityLogFiltersContext"
import DynamicWidthInput from "./DynamicWidthInput"
import FilterTag from "./FilterTag"

type Props = {
  filter: SupportedQueryParam
  label: string
  value: string
  onChange: (filter: Filter) => void
  onRemove: (filter: Filter) => void
  onEnter: () => void
}

const UserTagInput = ({
  filter: filterProp,
  label,
  value,
  onChange: onChangeProp,
  onRemove,
  onEnter,
}: Props): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [shouldRemove, setShouldRemove] = useState(value.length === 0)

  const [filterValue, setFilterValue] = useState(value)

  const filter: Filter = {
    filter: filterProp,
    value: filterValue,
  }

  useEffect(() => inputRef.current.focus(), [])

  const [isLoading, setIsLoading] = useState(false)

  const onChange = async (e) => {
    const newValue = e.target.value

    if (filterProp !== "userId") {
      setFilterValue(newValue)
      return
    }

    const splittedValue = newValue.split(",")
    const newValueAsArray = []

    for (const v of splittedValue) {
      const trimmedValue = v.trim()
      if (ADDRESS_REGEX.test(trimmedValue)) {
        setIsLoading(true)
        try {
          const guildUser = await fetcher(`/v2/users/${trimmedValue}`)
          newValueAsArray.push(guildUser.id)
        } catch {
          newValueAsArray.push(trimmedValue)
        } finally {
          setIsLoading(false)
        }
      } else {
        newValueAsArray.push(v)
      }
    }

    setFilterValue(newValueAsArray.join())
  }

  return (
    <FilterTag
      onRemove={() => onRemove(filter)}
      label={label}
      isLoading={isLoading}
      onClick={() => inputRef.current.focus()}
    >
      <DynamicWidthInput
        ref={inputRef}
        id={filterProp}
        variant="unstyled"
        borderRadius="none"
        value={filterValue}
        onChange={onChange}
        onBlur={() => onChangeProp(filter)}
        onKeyUp={(e) => {
          if (e.currentTarget.value.length > 0 && e.code === "Enter") onEnter()

          if (
            e.currentTarget.value.length === 0 &&
            e.code === "Backspace" &&
            shouldRemove
          )
            onRemove(filter)

          setShouldRemove(e.currentTarget.value.length === 0)
        }}
      />
    </FilterTag>
  )
}

export default UserTagInput
