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
  role: Role
  isTruncated?: boolean
} & StackProps

const SimpleRoleTag = ({ role, isTruncated, ...rest }: Props) => {
  const { colorMode } = useColorMode()

  return (
    <HStack spacing={1} alignItems={"flex-start"} {...rest}>
      <Center boxSize="5" flexShrink={0} top="0.5" pos="relative">
        {role.imageUrl?.startsWith("/guildLogos") ? (
          <Img
            src={role.imageUrl}
            boxSize="3"
            filter={colorMode === "light" && "brightness(0)"}
          />
        ) : (
          <Img src={role.imageUrl} boxSize="5" borderRadius={"full"} />
        )}
      </Center>
      <Text noOfLines={isTruncated ? 1 : null}>{role.name}</Text>
    </HStack>
  )
}

export default SimpleRoleTag
