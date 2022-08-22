import { Checkbox, Heading, HStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import MemberCount from "components/[guild]/RoleCard/components/MemberCount"
import { useFormContext, useWatch } from "react-hook-form"
import { Role } from "types"

type Props = {
  role: Role
  index: number
}

const RoleOptionCard = ({ role, index }: Props) => {
  const { register } = useFormContext()

  const isChecked = useWatch({ name: `roleIds.${index}` })

  return (
    <Card key={role.id}>
      <Checkbox
        value={role.id}
        size="lg"
        p="6"
        spacing="0"
        flexDirection={"row-reverse"}
        justifyContent="space-between"
        {...register(`roleIds.${index}`)}
        isChecked={isChecked}
      >
        <HStack spacing={4}>
          <GuildLogo imageUrl={role.imageUrl} size={48} iconSize={12} />
          <Heading as="h3" fontSize="xl" fontFamily="display">
            {role.name}
          </Heading>
          <MemberCount memberCount={role.memberCount} />
        </HStack>
      </Checkbox>
    </Card>
  )
}

export default RoleOptionCard
