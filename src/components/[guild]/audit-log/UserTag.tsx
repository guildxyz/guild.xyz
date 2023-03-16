import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"
import GuildAvatar from "components/common/GuildAvatar"
import shortenHex from "utils/shortenHex"

type Props = {
  address: string
}

const UserTag = ({ address }: Props): JSX.Element => (
  <Tag variant="solid" colorScheme="gray">
    <TagLeftIcon mr={0.5} as={GuildAvatar} address={address} size={3} />
    <TagLabel>{shortenHex(address, 3)}</TagLabel>
  </Tag>
)

export default UserTag
