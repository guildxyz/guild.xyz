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

const RoleTags = ({ roleIds }: Props) => {
  const renderedRoleIds = roleIds.slice(0, 3)
  const moreRolesCount = roleIds?.length - 3

  const moreRolesTagBorderColor = useColorModeValue("gray-300", "whiteAlpha-300")

  return (
    <HStack>
      {renderedRoleIds.map((roleId) => (
        <RoleTag key={roleId} roleId={roleId} />
      ))}
      {moreRolesCount && (
        <Tag
          variant={"outline"}
          color="initial"
          sx={{
            "--badge-color": `var(--chakra-colors-${moreRolesTagBorderColor}) !important`,
          }}
        >
          <TagLabel>{`${moreRolesCount} more roles`}</TagLabel>
        </Tag>
      )}
    </HStack>
  )
}
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
