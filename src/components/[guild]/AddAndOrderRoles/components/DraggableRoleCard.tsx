import { Heading, HStack, Icon, Spacer } from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import MemberCount from "components/[guild]/RoleCard/components/MemberCount"
import { DotsSixVertical } from "phosphor-react"
import { Role } from "types"

type Props = {
  role: Role
  isDisabled?: boolean
}

const DraggableRoleCard = ({ role, isDisabled }: Props) => {
  if (!role) return null

  return (
    <Card p={4} cursor="grab" mb="3" opacity={isDisabled ? 0.5 : 1}>
      <HStack spacing={4}>
        <GuildLogo imageUrl={role.imageUrl} size={"36px"} />
        <Heading as="h3" fontSize={"md"} fontFamily="display">
          {role.name}
        </Heading>
        <MemberCount memberCount={role.members?.length ?? role.memberCount} />
        <Spacer />
        <Icon as={DotsSixVertical} />
      </HStack>
    </Card>
  )
}

export default DraggableRoleCard
