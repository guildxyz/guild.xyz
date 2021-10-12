import { Icon } from "@chakra-ui/react"
import addressAvatarPairs from "constants/avatars/addressAvatarPairs"
import dynamic from "next/dynamic"

type Props = {
  size?: number
  address: string
}

const GuildAvatar = ({ size = 8, address }: Props): JSX.Element => {
  const Avatar = dynamic(
    () => import(`static/avatars/${addressAvatarPairs[address.slice(-2)]}.svg`)
  )

  return <Icon as={Avatar} boxSize={size} />
}

export default GuildAvatar
