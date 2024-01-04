import {
  Center,
  HStack,
  Img,
  StackProps,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import { Role } from "types"

type Props = {
  roleData: Role
  isTruncated?: boolean
} & StackProps

const SimpleRoleTag = ({ roleData, isTruncated, ...rest }: Props) => {
  const { colorMode } = useColorMode()

  return (
    <HStack spacing={1} alignItems={"flex-start"} {...rest}>
      <Center boxSize="5" flexShrink={0} top="0.5" pos="relative">
        {roleData.imageUrl?.startsWith("/guildLogos") ? (
          <Img
            src={roleData.imageUrl}
            boxSize="3"
            filter={colorMode === "light" && "brightness(0)"}
          />
        ) : (
          <Img src={roleData.imageUrl} boxSize="5" borderRadius={"full"} />
        )}
      </Center>
      <Text noOfLines={isTruncated ? 1 : null}>{roleData.name}</Text>
    </HStack>
  )
}

export default SimpleRoleTag
