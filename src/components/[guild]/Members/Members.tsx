import { Img, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import useMembers from "./hooks/useMembers"

const Members = () => {
  const members = useMembers()

  return (
    <SimpleGrid
      columns={{ base: 2, sm: 3, md: 4, lg: 6, xl: 8 }}
      gap={{ base: 5, md: 6 }}
    >
      {members?.map((member) => (
        <VStack spacing={2}>
          <Img
            src="https://avatars.githubusercontent.com/u/53289941?s=48&v=4"
            rounded="full"
          />
          <Text fontFamily="display" fontWeight="semibold" fontSize="sm">
            {member}
          </Text>
        </VStack>
      ))}
    </SimpleGrid>
  )
}

export default Members
