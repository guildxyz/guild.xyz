import { Center, HStack, Img, Text, useColorMode } from "@chakra-ui/react"

const SimpleRoleTag = ({ role }) => {
  const { colorMode } = useColorMode()

  return (
    <HStack spacing={1} alignItems={"flex-start"}>
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
      <Text>{role.name}</Text>
    </HStack>
  )
}

export default SimpleRoleTag
