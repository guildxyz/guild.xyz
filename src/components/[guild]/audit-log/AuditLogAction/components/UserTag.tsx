import { Tag, TagLabel, TagLeftIcon, Tooltip } from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import { useRouter } from "next/router"
import shortenHex from "utils/shortenHex"

type Props = {
  address: string
}

const UserTag = ({ address }: Props): JSX.Element => {
  const router = useRouter()

  return (
    <Tooltip label="Filter by user">
      <Tag
        as="button"
        variant="solid"
        colorScheme="gray"
        cursor="pointer"
        onClick={() => {
          router.replace({
            pathname: router.pathname,
            query: { ...router.query, userId: "todo" },
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
