import {
  HStack,
  IconButton,
  IconButtonProps,
  Spinner,
  Tag,
  TagProps,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { X } from "phosphor-react"
import { PropsWithChildren } from "react"

type Props = {
  onRemove: () => void
  label: string
  isLoading?: boolean
  onClick?: () => void
  closeButtonProps?: Omit<IconButtonProps, "aria-label">
} & TagProps

const FilterTag = ({
  onRemove,
  label,
  isLoading,
  onClick,
  closeButtonProps,
  children,
  ...tagProps
}: PropsWithChildren<Props>): JSX.Element => {
  const tagFontColor = useColorModeValue("black", undefined)
  const closeBtnFocusBgColor = useColorModeValue("blackAlpha.300", "whiteAlpha.500")

  return (
    <Tag
      color={tagFontColor}
      position="relative"
      borderColor="transparent"
      onClick={onClick}
      pr={7}
      {...tagProps}
    >
      <HStack>
        <Text as="span" fontSize="sm" fontWeight="bold">
          {label}
        </Text>

        {children}
      </HStack>

      {isLoading ? (
        <Spinner
          size="xs"
          position="absolute"
          top="calc(var(--chakra-space-1-5) - var(--chakra-space-0-5) / 2)"
          right={1}
        />
      ) : (
        <IconButton
          position="absolute"
          top="calc(var(--chakra-space-1) - var(--chakra-space-0-5) / 2)"
          right={1}
          aria-label="Remove filter"
          icon={<X />}
          size="xs"
          boxSize={4}
          minW={4}
          minH={4}
          onClick={onRemove}
          _focusVisible={{
            bgColor: closeBtnFocusBgColor,
            boxShadow: "none",
          }}
          {...closeButtonProps}
        />
      )}
    </Tag>
  )
}

export default FilterTag
