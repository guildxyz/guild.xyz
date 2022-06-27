import { HStack, Icon, Text } from "@chakra-ui/react"
import { Users } from "phosphor-react"

type Props = {
  memberCount: number
}

const MemberCount = ({ memberCount }: Props) => (
  <HStack pt={1.5}>
    <Icon as={Users} textColor="gray" />
    <Text as="span" color="gray" fontSize="sm">
      {memberCount >= 1000 ? `${(memberCount / 1000).toFixed(1)}k` : memberCount}
    </Text>
  </HStack>
)

export default MemberCount
