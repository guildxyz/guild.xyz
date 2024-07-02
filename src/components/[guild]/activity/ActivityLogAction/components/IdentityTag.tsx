import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"
import { Wallet } from "@phosphor-icons/react"
import rewards from "platforms/rewards"
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
      <TagLeftIcon as={icon ?? Wallet} mr={1} />
      <TagLabel>{username ?? rewards[platformName]?.name ?? "Wallet"}</TagLabel>
    </Tag>
  )
}

export default IdentityTag
