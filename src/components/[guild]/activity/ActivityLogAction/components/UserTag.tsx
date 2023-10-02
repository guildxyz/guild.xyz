import {
  forwardRef,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagProps,
  useColorModeValue,
} from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import useSWRImmutable from "swr/immutable"
import shortenHex from "utils/shortenHex"
import { useActivityLog } from "../../ActivityLogContext"
import ClickableTagPopover from "./ClickableTagPopover"
import CopyAddress from "./ClickableTagPopover/components/CopyAddress"
import FilterBy from "./ClickableTagPopover/components/FilterBy"
import ViewInCRM from "./ClickableTagPopover/components/ViewInCRM"

type Props = {
  address?: string
  userId?: number
} & TagProps

const UserTag = forwardRef<Props, "span">(
  ({ address: addressProp, userId, ...rest }, ref): JSX.Element => {
    const variant = useColorModeValue("subtle", "solid")
    const colorScheme = useColorModeValue("alpha", "gray")

    const { data } = useActivityLog()
    const staticAddress =
      addressProp ?? data?.values.users.find((u) => u.id === userId)?.address

    const { data: publicUserData } = useSWRImmutable(
      staticAddress ? null : `/v2/users/${userId}`
    )

    const address = staticAddress ?? publicUserData?.address

    return (
      <Tag
        ref={ref}
        variant={variant}
        colorScheme={colorScheme}
        minW="max-content"
        h="max-content"
        overflow="hidden"
        _focusWithin={{
          boxShadow: "outline",
        }}
        {...rest}
      >
        {address && (
          <TagLeftIcon mr={0.5} as={GuildAvatar} address={address} size={3} />
        )}
        <TagLabel>
          {address ? shortenHex(address, 3) : userId ?? "Unknown user"}
        </TagLabel>
      </Tag>
    )
  }
)

type ClickableUserTagProps = {
  userId: number
}

const ClickableUserTag = ({ userId }: ClickableUserTagProps): JSX.Element => {
  const { data } = useActivityLog()
  const address = data.values.users.find((u) => u.id === userId)?.address

  return (
    <ClickableTagPopover
      options={
        <>
          <FilterBy
            filter={{
              filter: "userId",
              value: userId.toString(),
            }}
          />
          <ViewInCRM
            label="View user in members"
            queryKey="search"
            queryValue={address}
          />
          <CopyAddress address={address} />
        </>
      }
    >
      <UserTag address={address} cursor="pointer" />
    </ClickableTagPopover>
  )
}

export default UserTag
export { ClickableUserTag }
