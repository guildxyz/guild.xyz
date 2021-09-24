import { Img } from "@chakra-ui/react"
import addressAvatarPairs from "constants/avatars/addressAvatarPairs"

type Props = {
  size?: number
  address: string
}

const GuildAvatar = ({ size = 6, address }: Props): JSX.Element => (
  <Img
    src={`/avatars/${addressAvatarPairs[address.slice(-2)]}.svg`}
    boxSize={size}
  />
)

export default GuildAvatar
