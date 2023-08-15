import {
  HStack,
  Img,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Wrap,
  useColorModeValue,
} from "@chakra-ui/react"
import { Visibility } from "types"
import useGuild from "../hooks/useGuild"

type Props = {
  roleIds: number[]
}

const RoleTags = ({ roleIds }: Props) => {
  const renderedRoleIds = roleIds?.slice(0, 3)
  const moreRolesCount = roleIds?.length - 3
  const moreRoleIds = moreRolesCount > 0 && roleIds?.slice(-moreRolesCount)

  const moreRolesTagBorderColor = useColorModeValue("gray-300", "whiteAlpha-300")

  if (!renderedRoleIds?.length) return <Text>-</Text>

  return (
    <HStack>
      {renderedRoleIds.map((roleId) => (
        <RoleTag key={roleId} roleId={roleId} />
      ))}
      {moreRolesCount > 0 && (
        <Popover trigger="hover" openDelay={0} closeDelay={0}>
          <PopoverTrigger>
            <Tag
              variant={"outline"}
              color="initial"
              sx={{
                "--badge-color": `var(--chakra-colors-${moreRolesTagBorderColor}) !important`,
              }}
            >
              <TagLabel>{`${moreRolesCount} more roles`}</TagLabel>
            </Tag>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <Wrap>
                {moreRoleIds.map((roleId) => (
                  <RoleTag key={roleId} roleId={roleId} />
                ))}
              </Wrap>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </HStack>
  )
}
export const RoleTag = ({ roleId }: { roleId: number }) => {
  const { roles } = useGuild()
  const role = roles.find((r) => r.id === roleId)

  const publicRoleBg = useColorModeValue("gray.700", "blackAlpha.300")

  if (!role) return null

  return (
    <Tag
      {...(role.visibility === Visibility.HIDDEN
        ? { variant: "solid", colorScheme: "gray" }
        : { bg: publicRoleBg, color: "white" })}
    >
      {role.imageUrl?.startsWith("/guildLogos") ? (
        <TagLeftIcon as={Img} src={role.imageUrl} />
      ) : (
        <TagLeftIcon
          as={Img}
          src={role.imageUrl}
          borderRadius={"full"}
          boxSize="4"
        />
      )}
      <TagLabel>{role.name}</TagLabel>
    </Tag>
  )
}

export default RoleTags
