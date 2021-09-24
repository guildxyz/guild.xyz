import { Img } from "@chakra-ui/react"
import addressAvatarPairs from "constants/avatars/addressAvatarPairs"

type Props = {
  address: string
}

const GuildAvatar = ({ address }: Props): JSX.Element => (
  <Img
    src={`/avatars/${addressAvatarPairs[address.slice(-2)]}.svg`}
    boxSize={{ base: 6, md: 8 }}
  />
)

export default GuildAvatar
