import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { PlatformName } from "types"

type Props = {
  platformName: PlatformName
  username: string
}

const IdentityTag = ({ platformName, username }: Props): JSX.Element => {
  const { colorScheme, icon } = platforms[platformName]

  return (
    <Tag
      bgColor={colorScheme ? `${colorScheme}.500` : "gray.500"}
      color="white"
      minW="max-content"
      h="max-content"
    >
      <TagLeftIcon as={icon} mr={1} />
      <TagLabel>{username ?? platforms[platformName].name}</TagLabel>
    </Tag>
  )
}

export default IdentityTag
