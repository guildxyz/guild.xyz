import { SimpleGrid } from "@chakra-ui/react"
import useMembers from "./hooks/useMembers"
import Member from "./Member"

const Members = () => {
  const members = useMembers()

  return (
    <SimpleGrid
      columns={{ base: 2, sm: 3, md: 4, lg: 6, xl: 8 }}
      gap={{ base: 5, md: 6 }}
      mt={4}
    >
      {members?.map((member) => (
        <Member address={member} />
      ))}
    </SimpleGrid>
  )
}

export default Members
