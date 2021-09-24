import { SimpleGrid, Text } from "@chakra-ui/react"
import useMembers from "./hooks/useMembers"
import Member from "./Member"

const Members = () => {
  const members = useMembers()

  if (!members?.length) return <Text>This guild has no members yet</Text>

  return (
    <SimpleGrid
      columns={{ base: 3, sm: 4, md: 6, lg: 8 }}
      gap={{ base: 6, md: 8 }}
      mt={3}
    >
      {members?.map((member) => (
        <Member key={member} address={member} />
      ))}
    </SimpleGrid>
  )
}

export default Members
