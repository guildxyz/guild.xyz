import { HStack, IconButton, Tag, Text } from "@chakra-ui/react"
import { X } from "phosphor-react"
import { useState } from "react"
import { SupportedQueryParam } from "../../hooks/useAuditLog"
import DynamicWidthInput from "./DynamicWidthInput"
import { Filter } from "./FiltersInput"

type Props = {
  name: SupportedQueryParam
  value: string
  onChange: (filter: Filter) => void
  onRemove: (filter: Filter) => void
  onEnter: () => void
}

const TagInput = ({
  name,
  value,
  onChange,
  onRemove,
  onEnter,
}: Props): JSX.Element => {
  const [filterValue, setFilterValue] = useState(value)

  const filter = {
    filter: name,
    value: filterValue,
  }

  return (
    <Tag
      borderWidth={1}
      borderColor="transparent"
      _focusWithin={{
        borderColor: "gray",
      }}
    >
      <HStack>
        <Text as="span" fontSize="sm" fontWeight="bold">
          {name}:
        </Text>
        <DynamicWidthInput
          id={name}
          variant="unstyled"
          borderRadius="none"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          onBlur={() => onChange(filter)}
          onKeyUp={(e) => {
            if (e.currentTarget.value.length > 0 && e.code === "Enter") onEnter()
            if (!e.currentTarget.value.length && e.code === "Backspace")
              onRemove(filter)
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
        />
      </HStack>
    </Tag>
  )
}

export default TagInput
