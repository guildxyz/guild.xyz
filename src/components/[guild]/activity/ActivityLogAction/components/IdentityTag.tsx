import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"
import { PiWallet } from "react-icons/pi"
import rewards from "rewards"
import { PlatformName } from "types"

type Props = {
  platformName: PlatformName
  username: string
}

const IdentityTag = ({ platformName, username }: Props): JSX.Element => {
  const { colorScheme, icon } = rewards[platformName] ?? {}

  return (
    <Tag
      bgColor={colorScheme ? `${colorScheme}.500` : "gray.500"}
      color="white"
      minW="max-content"
      h="max-content"
    >
      <TagLeftIcon as={icon ?? PiWallet} mr={1} />
      <TagLabel>{username ?? rewards[platformName]?.name ?? "PiWallet"}</TagLabel>
    </Tag>
  )
}

export default IdentityTag
