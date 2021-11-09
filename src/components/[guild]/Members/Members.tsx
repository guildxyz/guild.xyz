import { SimpleGrid, Text } from "@chakra-ui/react"
import Member from "./Member"

type Props = {
  members: Array<string>
  fallbackText: string
}

const Members = ({ members, fallbackText }: Props): JSX.Element => {
  if (!members?.length) return <Text>{fallbackText}</Text>

  return (
    <SimpleGrid
      columns={{ base: 3, sm: 4, md: 6, lg: 8 }}
      gap={{ base: 6, md: 8 }}
      mt={3}
    >
      {members?.map((address) => (
        <Member key={address} address={address} />
      ))}
    </SimpleGrid>
  )
}

export default Members
