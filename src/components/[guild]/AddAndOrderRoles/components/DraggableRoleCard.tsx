import { HStack, Heading, Icon, Spacer } from "@chakra-ui/react"
import { DotsSixVertical } from "@phosphor-icons/react"
import { MemberCount } from "components/[guild]/RoleCard/components/MemberCount"
import { Visibility } from "components/[guild]/Visibility"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import { Role } from "types"

type Props = {
  role: Role
}

const DraggableRoleCard = ({ role }: Props) => {
  if (!role) return null

  return (
    <Card p={4} cursor="grab" mb="3">
      <HStack spacing={4}>
        <GuildLogo imageUrl={role.imageUrl} size={"36px"} />

        <HStack spacing={1}>
          <Heading
            as="h3"
            fontSize="md"
            fontFamily="display"
            wordBreak="break-all"
            noOfLines={1}
          >
            {role.name}
          </Heading>

          <MemberCount
            memberCount={role.members?.length ?? role.memberCount}
            className="!bg-transparent text-muted-foreground"
          />
          <Visibility
            entityVisibility={role.visibility}
            visibilityRoleId={role.visibilityRoleId}
            size="sm"
            className="mt-1"
          />
        </HStack>

        <Spacer />

        <Icon as={DotsSixVertical} />
      </HStack>
    </Card>
  )
}

export default DraggableRoleCard
