import { HStack, IconButton, Tag, Text, useColorModeValue } from "@chakra-ui/react"
import { X } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import { SupportedQueryParam } from "../../ActivityLogContext"
import DynamicWidthInput from "./DynamicWidthInput"
import { Filter } from "./FiltersInput"

type Props = {
  filter: SupportedQueryParam
  label: string
  value: string
  onChange: (filter: Filter) => void
  onRemove: (filter: Filter) => void
  onEnter: () => void
}

const TagInput = ({
  filter: filterProp,
  label,
  value,
  onChange,
  onRemove,
  onEnter,
}: Props): JSX.Element => {
  const tagFocusBorderColor = useColorModeValue("gray.300", "gray.500")
  const closeBtnFocusBgColor = useColorModeValue("blackAlpha.300", "whiteAlpha.500")

  const inputRef = useRef<HTMLInputElement>(null)
  const [shouldRemove, setShouldRemove] = useState(value.length === 0)

  const [filterValue, setFilterValue] = useState(value)

  const filter: Filter = {
    filter: filterProp,
    value: filterValue,
  }

  useEffect(() => inputRef.current.focus(), [])

  return (
    <Tag
      borderWidth={1}
      borderColor="transparent"
      _focusWithin={{
        borderColor: tagFocusBorderColor,
      }}
      onClick={() => inputRef.current.focus()}
    >
      <HStack>
        <Text as="span" fontSize="sm" fontWeight="bold">
          {label}:
        </Text>
        <DynamicWidthInput
          ref={inputRef}
          id={filterProp}
          variant="unstyled"
          borderRadius="none"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          onBlur={() => onChange(filter)}
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
        <IconButton
          aria-label="Remove filter"
          icon={<X />}
          size="xs"
          boxSize={4}
          minW={4}
          minH={4}
          onClick={() => onRemove(filter)}
          _focusVisible={{
            bgColor: closeBtnFocusBgColor,
            boxShadow: "none",
          }}
        />
      </HStack>
    </Tag>
  )
}

export default TagInput
