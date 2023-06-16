import {
  HStack,
  Img,
  Tag,
  TagLabel,
  TagLeftIcon,
  useColorModeValue,
} from "@chakra-ui/react"
import useGuild from "../hooks/useGuild"

type Props = {
  roleIds: number[]
}

const RoleTags = ({ roleIds }: Props) => (
  <HStack>
    {roleIds.map((roleId) => (
      <RoleTag key={roleId} roleId={roleId} />
    ))}
  </HStack>
)
const RoleTag = ({ roleId }: { roleId: number }) => {
  const { roles } = useGuild()
  const role = roles.find((r) => r.id === roleId)

  const bg = useColorModeValue("gray.700", "blackAlpha.300")

  if (!role) return null

  return (
    <Tag bg={bg} color="white">
      <TagLeftIcon as={Img} src={role.imageUrl} />
      <TagLabel>{role.name}</TagLabel>
    </Tag>
  )
}

export default RoleTags
