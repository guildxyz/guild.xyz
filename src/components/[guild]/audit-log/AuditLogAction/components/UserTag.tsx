import {
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import { useRouter } from "next/router"
import shortenHex from "utils/shortenHex"
import useAuditLog from "../../hooks/useAuditLog"

type Props = {
  id: number
}

const UserTag = ({ id }: Props): JSX.Element => {
  const variant = useColorModeValue("subtle", "solid")
  const colorScheme = useColorModeValue("alpha", "gray")

  const { data } = useAuditLog()
  const address = data.values.users.find((u) => u.id === id)?.address

  const router = useRouter()

  return (
    <Tooltip label="Filter by user" placement="top" hasArrow>
      <Tag
        as="button"
        variant={variant}
        colorScheme={colorScheme}
        cursor="pointer"
        onClick={() => {
          router.push({
            pathname: router.pathname,
            query: { ...router.query, userId: id },
          })
        }}
      >
        <TagLeftIcon mr={0.5} as={GuildAvatar} address={address} size={3} />
        <TagLabel>{address ? shortenHex(address, 3) : "Unknown user"}</TagLabel>
      </Tag>
    </Tooltip>
  )
}

export default UserTag
