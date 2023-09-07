import {
  Flex,
  forwardRef,
  Icon,
  IconButton,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagProps,
  Tooltip,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import { Check, Copy } from "phosphor-react"

import shortenHex from "utils/shortenHex"
import { useActivityLog } from "../../ActivityLogContext"
import { useActivityLogFilters } from "../../ActivityLogFiltersBar/components/ActivityLogFiltersContext"

type Props = {
  address?: string
  userId?: number
  onClick?: () => void
} & TagProps

const UserTag = forwardRef<Props, "span">(
  ({ address: addressProp, userId, onClick, ...rest }, ref): JSX.Element => {
    const variant = useColorModeValue("subtle", "solid")
    const colorScheme = useColorModeValue("alpha", "gray")

    const { data } = useActivityLog()
    const address =
      addressProp ?? data?.values.users.find((u) => u.id === userId)?.address

    return (
      <Tag
        ref={ref}
        variant={variant}
        colorScheme={colorScheme}
        minW="max-content"
        h="max-content"
        overflow="hidden"
        pr={onClick ? 0 : undefined}
        _focusWithin={{
          boxShadow: "outline",
        }}
        {...rest}
      >
        <Flex
          as={onClick ? "button" : undefined}
          alignItems="center"
          onClick={onClick}
          _focus={{
            outline: "none",
          }}
        >
          {address && (
            <TagLeftIcon mr={0.5} as={GuildAvatar} address={address} size={3} />
          )}
          <TagLabel>
            {address ? shortenHex(address, 3) : userId ?? "Unknown user"}
          </TagLabel>
        </Flex>

        {onClick && address && <CopyAddressButton address={address} />}
      </Tag>
    )
  }
)

type ClickableUserTagProps = {
  id: number
}

const ClickableUserTag = ({ id }: ClickableUserTagProps): JSX.Element => {
  const { data } = useActivityLog()
  const address = data.values.users.find((u) => u.id === id)?.address

  const filtersContext = useActivityLogFilters()
  const { activeFilters, addFilter } = filtersContext ?? {}
  const isDisabled =
    !filtersContext ||
    !!activeFilters.find((f) => f.filter === "userId" && f.value === id.toString())

  return (
    <Tooltip label="Filter by user" placement="top" hasArrow isDisabled={isDisabled}>
      <UserTag
        onClick={
          isDisabled
            ? undefined
            : () => addFilter({ filter: "userId", value: id.toString() })
        }
        address={address}
        cursor={isDisabled ? "default" : "pointer"}
      />
    </Tooltip>
  )
}

const CopyAddressButton = ({ address }: { address: string }): JSX.Element => {
  const focusBgColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200")
  const { onCopy, hasCopied } = useClipboard(address ?? "")

  return (
    <IconButton
      aria-label="Copy address"
      variant="ghost"
      size="xs"
      boxSize={6}
      ml={1}
      borderRadius="none"
      onClick={onCopy}
      icon={<Icon as={hasCopied ? Check : Copy} />}
      _focus={{
        boxShadow: "none",
        bgColor: focusBgColor,
      }}
    />
  )
}

export default UserTag
export { ClickableUserTag }
