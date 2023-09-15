import {
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tag,
  TagLabel,
  TagProps,
  Text,
  Wrap,
  forwardRef,
  useColorModeValue,
} from "@chakra-ui/react"
import { Visibility } from "types"
import RoleTag from "../RoleTag"
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
        <CrmRoleTag key={roleId} roleId={roleId} />
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
                  <CrmRoleTag key={roleId} roleId={roleId} />
                ))}
              </Wrap>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </HStack>
  )
}

type RoleTagProps = {
  roleId: number
  guildId?: number
} & TagProps

export const CrmRoleTag = forwardRef<RoleTagProps, "span">(
  ({ roleId, guildId, ...rest }, ref) => {
    const { roles } = useGuild(guildId)
    const role = roles.find((r) => r.id === roleId)

    if (!role) return null

    return (
      <RoleTag
        name={role.name}
        imageUrl={role.imageUrl}
        isHidden={role.visibility === Visibility.HIDDEN}
        {...rest}
      />
    )
  }
)

export default RoleTags
